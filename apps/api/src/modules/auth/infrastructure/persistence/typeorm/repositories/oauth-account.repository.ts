import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { OAuthAccountAlreadyLinkedError } from '../../../../domain/errors/oauth-account-already-linked.error';
import { OAuthProviderAlreadyConnectedError } from '../../../../domain/errors/oauth-provider-already-connected.error';

import {
  OAuthAccount,
  OAuthProvider,
} from '../../../../domain/entities/oauth-account.entity';

import {
  CreateOAuthAccountData,
  OAuthAccountRepositoryPort,
} from '../../../../application/ports/oauth-account.repository.port';

import { OAuthAccountOrmEntity } from '../entities/oauth-account.orm-entity';

@Injectable()
export class OAuthAccountRepository implements OAuthAccountRepositoryPort {
  constructor(
    @InjectRepository(OAuthAccountOrmEntity)
    private readonly repository: Repository<OAuthAccountOrmEntity>,
  ) {}

  async findByProviderSubject(
    provider: OAuthProvider,
    providerSubject: string,
  ): Promise<OAuthAccount | null> {
    const entity = await this.repository.findOne({
      where: { provider, providerSubject },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findByUserAndProvider(
    userId: string,
    provider: OAuthProvider,
  ): Promise<OAuthAccount | null> {
    const entity = await this.repository.findOne({
      where: { userId, provider },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async create(data: CreateOAuthAccountData): Promise<OAuthAccount> {
    const entity = this.repository.create({
      ...data,
      createdAt: new Date(),
    });

    try {
      const saved = await this.repository.save(entity);

      return this.toDomain(saved);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const { code, constraint } = error.driverError as {
          code?: string;
          constraint?: string;
        };

        if (code === '23505' && constraint === 'UQ_oauth_provider_subject') {
          throw new OAuthAccountAlreadyLinkedError();
        }

        if (code === '23505' && constraint === 'UQ_oauth_user_provider') {
          throw new OAuthProviderAlreadyConnectedError();
        }
      }

      throw error;
    }
  }

  async deleteByUserAndProvider(
    userId: string,
    provider: OAuthProvider,
  ): Promise<boolean> {
    const result = await this.repository.delete({
      userId,
      provider,
    });

    return (result.affected ?? 0) > 0;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.repository.count({
      where: { userId },
    });
  }

  private toDomain(entity: OAuthAccountOrmEntity): OAuthAccount {
    return OAuthAccount.reconstitute({
      id: entity.id,
      userId: entity.userId,
      provider: entity.provider as OAuthProvider,
      providerSubject: entity.providerSubject,
      email: entity.email,
      emailVerified: entity.emailVerified,
      createdAt: entity.createdAt,
    });
  }
}
