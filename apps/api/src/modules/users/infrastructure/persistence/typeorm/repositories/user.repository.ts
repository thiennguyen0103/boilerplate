import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exists.error';
import {
  CreateUserData,
  UpdateUserData,
  UserRepositoryPort,
} from 'src/modules/users/application/ports/user.repository.port';

import { UserOrmEntity } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { UserMapper } from 'src/modules/users/infrastructure/persistence/typeorm/mappers/user.mapper';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async create(data: CreateUserData): Promise<User> {
    const entity = this.repository.create({
      email: data.email,
      name: data.name,
      passwordHash: data.passwordHash,
      status: UserStatus.ACTIVE,
      emailVerified: data.emailVerified ?? false,
    });

    try {
      const saved = await this.repository.save(entity);

      return UserMapper.toDomain(saved);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new EmailAlreadyExistsError(data.email);
      }

      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.repository.exists({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    await this.repository.update(id, data);

    return this.findById(id);
  }

  async changeStatus(id: string, status: UserStatus): Promise<User | null> {
    await this.repository.update(id, { status });

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
