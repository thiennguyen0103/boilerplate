import { RefreshSessionRepositoryPort } from 'src/modules/auth/application/ports/refresh-session.repository.port';

export interface UserSessionDto {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date;
  isCurrent: boolean;
}

export class ListSessionsUseCase {
  constructor(private readonly sessions: RefreshSessionRepositoryPort) {}

  async execute(input: {
    userId: string;
    currentSessionId: string;
  }): Promise<UserSessionDto[]> {
    const sessions = await this.sessions.listActiveByUserId(input.userId);

    return sessions.map((session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
      isCurrent: session.id === input.currentSessionId,
    }));
  }
}
