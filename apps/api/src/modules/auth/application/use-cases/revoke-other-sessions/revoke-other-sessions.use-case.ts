import { InvalidRefreshTokenError } from 'src/modules/auth/domain/errors/invalid-refresh-token.error';
import { RefreshSessionRepositoryPort } from 'src/modules/auth/application/ports/refresh-session.repository.port';

export class RevokeOtherSessionsUseCase {
  constructor(private readonly sessions: RefreshSessionRepositoryPort) {}

  async execute(input: {
    userId: string;
    currentSessionId: string;
  }): Promise<number> {
    const currentSession = await this.sessions.findById(input.currentSessionId);

    if (
      !currentSession ||
      currentSession.userId !== input.userId ||
      !currentSession.isActive
    ) {
      throw new InvalidRefreshTokenError();
    }

    return this.sessions.revokeAllExcept(
      input.userId,
      currentSession.id,
      new Date(),
    );
  }
}
