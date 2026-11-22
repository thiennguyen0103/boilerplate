import { RefreshSession } from 'src/modules/auth/domain/entities/refresh-session.entity';

export interface CreateRefreshSessionData {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent: string | null;
  ipAddress: string | null;
}

export interface RotateRefreshSessionData {
  sessionId: string;
  currentTokenHash: string;
  nextTokenHash: string;
  nextExpiresAt: Date;
  rotatedAt: Date;
}

export interface SessionListItem {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date;
  isCurrent: boolean;
}

export interface RefreshSessionRepositoryPort {
  create(data: CreateRefreshSessionData): Promise<RefreshSession>;
  findByTokenHash(tokenHash: string): Promise<RefreshSession | null>;
  findById(sessionId: string): Promise<RefreshSession | null>;
  findSessionIdByUsedTokenHash(tokenHash: string): Promise<string | null>;
  listActiveByUserId(userId: string): Promise<RefreshSession[]>;
  listByUserId(userId: string): Promise<RefreshSession[]>;
  revoke(sessionId: string, userId: string, revokedAt: Date): Promise<boolean>;
  revokeAllExcept(
    userId: string,
    currentSessionId: string,
    revokedAt: Date,
  ): Promise<number>;
  revokeAllByUserId(userId: string, revokedAt: Date): Promise<number>;
  rotate(data: RotateRefreshSessionData): Promise<boolean>;
  deleteExpired(now: Date): Promise<number>;
}
