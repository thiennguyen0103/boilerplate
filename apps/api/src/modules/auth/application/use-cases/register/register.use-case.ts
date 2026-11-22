import { UsersService } from 'src/modules/users/application/services/users.service';
import { PasswordHasherPort } from '../../ports/password-hasher.port';
import { AccessTokenPort } from '../../ports/access-token.port';
import { TokenGeneratorPort } from '../../ports/token-generator.port';
import { RefreshSessionRepositoryPort } from '../../ports/refresh-session.repository.port';
import { AuthResult } from '../auth-result';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exists.error';
import { IdGeneratorPort } from '../../ports/id-generator.port';

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export class RegisterUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly accessToken: AccessTokenPort,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly sessions: RefreshSessionRepositoryPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly refreshTokenExpiresInDays: number,
  ) {}

  async execute(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await this.usersService.getByEmail(input.email);

    if (existingUser) {
      throw new EmailAlreadyExistsError(existingUser.email.getValue());
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.usersService.create({
      email: input.email,
      name: input.name,
      passwordHash,
      emailVerified: false,
    });

    const sessionId = this.idGenerator.generate();

    const accessToken = await this.accessToken.sign({
      sub: user.id,
      email: user.email.getValue(),
      sessionId,
    });

    const refreshToken = this.tokenGenerator.generate();

    await this.sessions.create({
      id: sessionId,
      userId: user.id,
      tokenHash: this.tokenGenerator.hash(refreshToken),
      expiresAt: new Date(
        Date.now() + this.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000,
      ),
      userAgent: input.userAgent ?? null,
      ipAddress: input.ipAddress ?? null,
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
}
