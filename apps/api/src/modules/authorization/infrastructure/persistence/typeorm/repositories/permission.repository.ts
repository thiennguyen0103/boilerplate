import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from 'src/modules/authorization/domain/entities/permission.entity';
import { PermissionRepositoryPort } from 'src/modules/authorization/application/ports/permission.repository.port';
import { PermissionOrmEntity } from 'src/modules/authorization/infrastructure/persistence/typeorm/entities/permission.orm-entity';

@Injectable()
export class PermissionRepository implements PermissionRepositoryPort {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly repository: Repository<PermissionOrmEntity>,
  ) {}

  async findByCode(code: string): Promise<Permission | null> {
    const entity = await this.repository.findOne({
      where: { code },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Permission[]> {
    const entities = await this.repository.find({
      order: { code: 'ASC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  private toDomain(entity: PermissionOrmEntity): Permission {
    return Permission.reconstitute({
      id: entity.id,
      code: entity.code,
      description: entity.description,
      createdAt: entity.createdAt,
    });
  }
}
