import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';

import {
  PERMISSION_CATALOG,
  DEFAULT_ROLE_PERMISSIONS,
  SYSTEM_ROLES,
} from 'src/modules/authorization/domain/constants/permissions';

import { RoleOrmEntity } from 'src/modules/authorization/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { PermissionOrmEntity } from 'src/modules/authorization/infrastructure/persistence/typeorm/entities/permission.orm-entity';
import { RolePermissionOrmEntity } from 'src/modules/authorization/infrastructure/persistence/typeorm/entities/role-permission.orm-entity';

export async function seedAuthorization(dataSource: DataSource): Promise<void> {
  await dataSource.transaction(async (manager) => {
    const roles = manager.getRepository(RoleOrmEntity);
    const permissions = manager.getRepository(PermissionOrmEntity);
    const rolePermissions = manager.getRepository(RolePermissionOrmEntity);

    // Seed permissions
    for (const item of PERMISSION_CATALOG) {
      await permissions
        .createQueryBuilder()
        .insert()
        .values({
          id: randomUUID(),
          code: item.code,
          description: item.description,
        })
        .orIgnore()
        .execute();
    }

    // Seed system roles
    const roleDefinitions = [
      {
        name: SYSTEM_ROLES.USER,
        description: 'Default authenticated user',
      },
      {
        name: SYSTEM_ROLES.MODERATOR,
        description: 'Moderate platform content',
      },
      {
        name: SYSTEM_ROLES.ADMIN,
        description: 'Manage platform resources',
      },
      {
        name: SYSTEM_ROLES.SUPER_ADMIN,
        description: 'Full platform administration',
      },
    ];

    for (const role of roleDefinitions) {
      await roles
        .createQueryBuilder()
        .insert()
        .values({
          id: randomUUID(),
          name: role.name,
          description: role.description,
          isSystem: true,
        })
        .orIgnore()
        .execute();
    }

    // Seed role permissions
    for (const [roleName, permissionCodes] of Object.entries(
      DEFAULT_ROLE_PERMISSIONS,
    )) {
      const role = await roles.findOneBy({
        name: roleName,
      });

      if (!role) {
        throw new Error(`Missing role: ${roleName}`);
      }

      for (const code of permissionCodes) {
        const permission = await permissions.findOneBy({
          code,
        });

        if (!permission) {
          throw new Error(`Missing permission: ${code}`);
        }

        await rolePermissions
          .createQueryBuilder()
          .insert()
          .values({
            roleId: role.id,
            permissionId: permission.id,
          })
          .orIgnore()
          .execute();
      }
    }
  });
}
