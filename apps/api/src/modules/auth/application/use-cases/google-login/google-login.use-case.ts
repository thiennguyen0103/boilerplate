import {
  GoogleIdentity,
  GoogleTokenVerifierPort,
} from '../../ports/google-token-verifier.port';
import { OAuthAccountRepositoryPort } from '../../ports/oauth-account.repository.port';

import { InvalidOAuthAccountError } from 'src/modules/auth/domain/errors/invalid-oauth-account.error';
import { OAuthAccountAlreadyLinkedError } from 'src/modules/auth/domain/errors/oauth-account-already-linked.error';
import { OAuthAccountLinkRequiredError } from 'src/modules/auth/domain/errors/oauth-account-link-require.error';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';
import { AccountNotActiveError } from 'src/modules/users/domain/errors/account-not-active.error';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exists.error';
import { AccessTokenPort } from '../../ports/access-token.port';
import { IdGeneratorPort } from '../../ports/id-generator.port';
import { RefreshSessionRepositoryPort } from '../../ports/refresh-session.repository.port';
import { TokenGeneratorPort } from '../../ports/token-generator.port';
import { AuthResult } from '../auth-result';

export interface GoogleLoginInput {
  idToken: string;
  userAgent: string | null;
  ipAddress: string | null;
}

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;

export class GoogleLoginUseCase {
  constructor(
    private readonly googleVerifier: GoogleTokenVerifierPort,
    private readonly oauthAccounts: OAuthAccountRepositoryPort,
    private readonly users: UsersService,
    private readonly sessions: RefreshSessionRepositoryPort,
    private readonly accessTokens: AccessTokenPort,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly refreshTokenExpiresInDays: number,
  ) {}

  async execute(input: GoogleLoginInput): Promise<AuthResult> {
    const google = await this.googleVerifier.verify(input.idToken);

    const user = await this.resolveUser(google);

    if (user.status !== UserStatus.ACTIVE) {
      throw new AccountNotActiveError();
    }

    const sessionId = this.idGenerator.generate();
    const refreshToken = this.tokenGenerator.generate();

    await this.sessions.create({
      id: sessionId,
      userId: user.id,
      tokenHash: this.tokenGenerator.hash(refreshToken),
      expiresAt: new Date(
        Date.now() + this.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000,
      ),
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    });

    const accessToken = await this.accessTokens.sign({
      sub: user.id,
      email: user.email.getValue(),
      sessionId,
    });

    return {
      user: {
        id: user.id,
        email: user.email.getValue(),
        name: user.name.getValue(),
        status: user.status,
        emailVerified: user.emailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  private async resolveUser(google: GoogleIdentity): Promise<User> {
    const linkedAccount = await this.oauthAccounts.findByProviderSubject(
      'google',
      google.subject,
    );

    if (linkedAccount) {
      return this.users.findById(linkedAccount.userId);
    }

    const user = await this.findOrCreateUserByEmail(google);

    try {
      await this.oauthAccounts.create({
        id: this.idGenerator.generate(),
        userId: user.id,
        provider: 'google',
        providerSubject: google.subject,
        email: google.email,
        emailVerified: google.emailVerified,
      });
    } catch (error) {
      if (!(error instanceof OAuthAccountAlreadyLinkedError)) {
        throw error;
      }

      // A concurrent login linked this Google account first.
      const account = await this.oauthAccounts.findByProviderSubject(
        'google',
        google.subject,
      );

      if (account?.userId !== user.id) {
        throw new InvalidOAuthAccountError();
      }
    }

    return user;
  }

  private async findOrCreateUserByEmail(google: GoogleIdentity): Promise<User> {
    const existingUser = await this.users.getByEmail(google.email);

    if (existingUser) {
      return this.assertCanAutoLink(existingUser);
    }

    try {
      return await this.users.create({
        email: google.email,
        name: this.displayName(google),
        emailVerified: true,
      });
    } catch (error) {
      if (!(error instanceof EmailAlreadyExistsError)) {
        throw error;
      }

      // A concurrent request created a user with this email first.
      const createdUser = await this.users.getByEmail(google.email);

      if (!createdUser) {
        throw error;
      }

      return this.assertCanAutoLink(createdUser);
    }
  }

  private assertCanAutoLink(user: User): User {
    if (!user.emailVerified) {
      throw new OAuthAccountLinkRequiredError();
    }

    return user;
  }

  private displayName(google: GoogleIdentity): string {
    const candidate = google.name?.trim() || google.email.split('@')[0];
    const name = candidate.length >= MIN_NAME_LENGTH ? candidate : google.email;

    return name.slice(0, MAX_NAME_LENGTH);
  }
}
