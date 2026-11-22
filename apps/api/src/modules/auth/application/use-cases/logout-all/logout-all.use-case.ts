import { RefreshSessionRepositoryPort } from 'src/modules/auth/application/ports/refresh-session.repository.port';

export interface LogoutAllInput {
  userId: string;
}

export class LogoutAllUseCase {
  constructor(private readonly sessions: RefreshSessionRepositoryPort) {}

  async execute(input: LogoutAllInput): Promise<void> {
    await this.sessions.revokeAllByUserId(input.userId, new Date());
  }
}
