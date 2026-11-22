import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  CreateRefreshSessionData,
  RefreshSessionRepositoryPort,
  RotateRefreshSessionData,
} from 'src/modules/auth/application/ports/refresh-session.repository.port';

import { RefreshSession } from 'src/modules/auth/domain/entities/refresh-session.entity';
import { RefreshSessionOrmEntity } from 'src/modules/auth/infrastructure/persistence/typeorm/entities/refresh-session.orm-entity';
import { RefreshTokenHistoryOrmEntity } from 'src/modules/auth/infrastructure/persistence/typeorm/entities/refresh-token-history.orm-entity';

@Injectable()
export class RefreshSessionRepository implements RefreshSessionRepositoryPort {
  constructor(
    @InjectRepository(RefreshSessionOrmEntity)
    private readonly repository: Repository<RefreshSessionOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(data: CreateRefreshSessionData): Promise<RefreshSession> {
    const entity = this.repository.create({
      ...data,
      revokedAt: null,
      lastUsedAt: null,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshSession | null> {
    const entity = await this.repository.findOne({
      where: { tokenHash },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findById(sessionId: string): Promise<RefreshSession | null> {
    const entity = await this.repository.findOne({
      where: { id: sessionId },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findSessionIdByUsedTokenHash(
    tokenHash: string,
  ): Promise<string | null> {
    const history = await this.dataSource
      .getRepository(RefreshTokenHistoryOrmEntity)
      .findOne({
        where: { tokenHash },
        select: { sessionId: true },
      });

    return history?.sessionId ?? null;
  }

  async listActiveByUserId(userId: string): Promise<RefreshSession[]> {
    const now = new Date();

    const entities = await this.repository
      .createQueryBuilder('session')
      .where('session.userId = :userId', { userId })
      .andWhere('session.revokedAt IS NULL')
      .andWhere('session.expiresAt > :now', { now })
      .orderBy('session.lastUsedAt', 'DESC', 'NULLS LAST')
      .addOrderBy('session.createdAt', 'DESC')
      .getMany();

    return entities.map((entity) => this.toDomain(entity));
  }

  async listByUserId(userId: string): Promise<RefreshSession[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async revoke(
    sessionId: string,
    userId: string,
    revokedAt: Date,
  ): Promise<boolean> {
    const result = await this.repository
      .createQueryBuilder()
      .update(RefreshSessionOrmEntity)
      .set({ revokedAt })
      .where('id = :sessionId', { sessionId })
      .andWhere('user_id = :userId', { userId })
      .andWhere('revoked_at IS NULL')
      .execute();

    return (result.affected ?? 0) > 0;
  }

  async revokeAllExcept(
    userId: string,
    currentSessionId: string,
    revokedAt: Date,
  ): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .update(RefreshSessionOrmEntity)
      .set({ revokedAt })
      .where('user_id = :userId', { userId })
      .andWhere('id != :currentSessionId', {
        currentSessionId,
      })
      .andWhere('revoked_at IS NULL')
      .execute();

    return result.affected ?? 0;
  }

  async revokeAllByUserId(userId: string, revokedAt: Date): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .update(RefreshSessionOrmEntity)
      .set({ revokedAt })
      .where('user_id = :userId', { userId })
      .andWhere('revoked_at IS NULL')
      .execute();

    return result.affected ?? 0;
  }

  async rotate(data: RotateRefreshSessionData): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const sessionRepository = manager.getRepository(RefreshSessionOrmEntity);

      const historyRepository = manager.getRepository(
        RefreshTokenHistoryOrmEntity,
      );

      // Conditional update ensures only one request can rotate
      // the current token successfully.
      const result = await sessionRepository
        .createQueryBuilder()
        .update(RefreshSessionOrmEntity)
        .set({
          tokenHash: data.nextTokenHash,
          expiresAt: data.nextExpiresAt,
          lastUsedAt: data.rotatedAt,
        })
        .where('id = :sessionId', {
          sessionId: data.sessionId,
        })
        .andWhere('token_hash = :currentTokenHash', {
          currentTokenHash: data.currentTokenHash,
        })
        .andWhere('revoked_at IS NULL')
        .andWhere('expires_at > :rotatedAt', {
          rotatedAt: data.rotatedAt,
        })
        .execute();

      if ((result.affected ?? 0) !== 1) {
        return false;
      }

      await historyRepository.insert({
        sessionId: data.sessionId,
        tokenHash: data.currentTokenHash,
      });

      return true;
    });
  }

  async deleteExpired(now: Date): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(RefreshSessionOrmEntity)
      .where('expires_at <= :now', { now })
      .execute();

    return result.affected ?? 0;
  }

  private toDomain(entity: RefreshSessionOrmEntity): RefreshSession {
    return RefreshSession.reconstitute({
      id: entity.id,
      userId: entity.userId,
      tokenHash: entity.tokenHash,
      expiresAt: entity.expiresAt,
      revokedAt: entity.revokedAt,
      lastUsedAt: entity.lastUsedAt,
      userAgent: entity.userAgent,
      ipAddress: entity.ipAddress,
      createdAt: entity.createdAt,
    });
  }
}
