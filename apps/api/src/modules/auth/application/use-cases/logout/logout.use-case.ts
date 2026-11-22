import { TokenGeneratorPort } from 'src/modules/auth/application/ports/token-generator.port';
import { RefreshSessionRepositoryPort } from 'src/modules/auth/application/ports/refresh-session.repository.port';

export interface LogoutInput {
  refreshToken: string;
}

export class LogoutUseCase {
  constructor(
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly sessions: RefreshSessionRepositoryPort,
  ) {}

  async execute(input: LogoutInput): Promise<void> {
    const tokenHash = this.tokenGenerator.hash(input.refreshToken);

    const session = await this.sessions.findByTokenHash(tokenHash);

    if (!session || session.isRevoked) {
      return;
    }

    await this.sessions.revoke(session.id, session.userId, new Date());
  }
}
