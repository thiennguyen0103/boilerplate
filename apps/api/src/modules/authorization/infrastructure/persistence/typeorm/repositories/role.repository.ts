import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';

import { Role } from 'src/modules/authorization/domain/entities/role.entity';
import {
  RoleRepositoryPort,
  CreateRoleData,
} from 'src/modules/authorization/application/ports/role.repository.port';

import { RoleOrmEntity } from 'src/modules/authorization/infrastructure/persistence/typeorm/entities/role.orm-entity';

@Injectable()
export class RoleRepository implements RoleRepositoryPort {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly repository: Repository<RoleOrmEntity>,
  ) {}

  async findById(id: string): Promise<Role | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const entity = await this.repository.findOne({
      where: { name },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Role[]> {
    const entities = await this.repository.find({
      order: { name: 'ASC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async create(data: CreateRoleData): Promise<Role> {
    const entity = this.repository.create({
      ...data,
      id: data.id || randomUUID(),
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: RoleOrmEntity): Role {
    return Role.reconstitute({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isSystem: entity.isSystem,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
