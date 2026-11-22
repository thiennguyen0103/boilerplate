import { GoogleTokenVerifierPort } from '../../ports/google-token-verifier.port';
import { OAuthAccountRepositoryPort } from '../../ports/oauth-account.repository.port';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { OAuthAccountAlreadyLinkedError } from 'src/modules/auth/domain/errors/oauth-account-already-linked.error';
import { OAuthProviderAlreadyConnectedError } from 'src/modules/auth/domain/errors/oauth-provider-already-connected.error';
import { IdGeneratorPort } from '../../ports/id-generator.port';
import { AccountNotActiveError } from 'src/modules/users/domain/errors/account-not-active.error';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';

export interface LinkGoogleAccountInput {
  userId: string;
  idToken: string;
}

export class LinkGoogleAccountUseCase {
  constructor(
    private readonly googleVerifier: GoogleTokenVerifierPort,
    private readonly oauthAccounts: OAuthAccountRepositoryPort,
    private readonly users: UsersService,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(input: LinkGoogleAccountInput): Promise<void> {
    const user = await this.users.findById(input.userId);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new AccountNotActiveError();
    }

    const google = await this.googleVerifier.verify(input.idToken);

    const existingGoogleAccount =
      await this.oauthAccounts.findByProviderSubject('google', google.subject);

    if (existingGoogleAccount) {
      if (existingGoogleAccount.userId === input.userId) {
        return;
      }

      throw new OAuthAccountAlreadyLinkedError();
    }

    const currentGoogleAccount = await this.oauthAccounts.findByUserAndProvider(
      input.userId,
      'google',
    );

    if (currentGoogleAccount) {
      throw new OAuthProviderAlreadyConnectedError();
    }

    await this.oauthAccounts.create({
      id: this.idGenerator.generate(),
      userId: input.userId,
      provider: 'google',
      providerSubject: google.subject,
      email: google.email,
      emailVerified: google.emailVerified,
    });
  }
}
