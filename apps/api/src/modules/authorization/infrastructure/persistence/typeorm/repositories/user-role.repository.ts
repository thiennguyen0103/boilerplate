import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Role } from 'src/modules/authorization/domain/entities/role.entity';
import { UserRoleRepositoryPort } from 'src/modules/authorization/application/ports/user-role.repository.port';

import { UserRoleOrmEntity } from 'src/modules/authorization/infrastructure/persistence/typeorm/entities/user-role.orm-entity';
import { RoleOrmEntity } from 'src/modules/authorization/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { RolePermissionOrmEntity } from 'src/modules/authorization/infrastructure/persistence/typeorm/entities/role-permission.orm-entity';
import { PermissionOrmEntity } from 'src/modules/authorization/infrastructure/persistence/typeorm/entities/permission.orm-entity';

@Injectable()
export class UserRoleRepository implements UserRoleRepositoryPort {
  constructor(
    @InjectRepository(UserRoleOrmEntity)
    private readonly repository: Repository<UserRoleOrmEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async assign(
    userId: string,
    roleId: string,
    assignedBy: string | null,
  ): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserRoleOrmEntity)
      .values({
        userId,
        roleId,
        assignedBy,
      })
      .orIgnore()
      .execute();
  }

  async remove(userId: string, roleId: string): Promise<boolean> {
    const result = await this.repository.delete({
      userId,
      roleId,
    });

    return (result.affected ?? 0) > 0;
  }

  async exists(userId: string, roleId: string): Promise<boolean> {
    return this.repository.exists({
      where: { userId, roleId },
    });
  }

  async findRolesByUserId(userId: string): Promise<Role[]> {
    const rows = await this.repository.find({
      where: { userId },
      relations: { role: true },
    });

    return rows.map((row) => this.toDomain(row.role));
  }

  async findRoleNamesByUserId(userId: string): Promise<string[]> {
    const rows = await this.repository
      .createQueryBuilder('userRole')
      .innerJoin(RoleOrmEntity, 'role', 'role.id = userRole.roleId')
      .select('role.name', 'name')
      .where('userRole.userId = :userId', { userId })
      .orderBy('role.name', 'ASC')
      .getRawMany<{ name: string }>();

    return rows.map((row) => row.name);
  }

  async findPermissionsByUserId(userId: string): Promise<string[]> {
    const rows = await this.repository
      .createQueryBuilder('userRole')
      .innerJoin(
        RolePermissionOrmEntity,
        'rolePermission',
        'rolePermission.roleId = userRole.roleId',
      )
      .innerJoin(
        PermissionOrmEntity,
        'permission',
        'permission.id = rolePermission.permissionId',
      )
      .select('permission.code', 'code')
      .where('userRole.userId = :userId', { userId })
      .distinct(true)
      .orderBy('permission.code', 'ASC')
      .getRawMany<{ code: string }>();

    return rows.map((row) => row.code);
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
