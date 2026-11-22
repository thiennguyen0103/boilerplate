import { RefreshSessionRepositoryPort } from 'src/modules/auth/application/ports/refresh-session.repository.port';

export class RevokeSessionUseCase {
  constructor(private readonly sessions: RefreshSessionRepositoryPort) {}

  async execute(input: { userId: string; sessionId: string }): Promise<void> {
    await this.sessions.revoke(input.sessionId, input.userId, new Date());
  }
}
