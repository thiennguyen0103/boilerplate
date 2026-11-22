import { Controller, Get, UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from 'src/modules/auth/presentation/http/guards/access-token.guard';

import { PermissionsGuard } from 'src/modules/authorization/presentation/http/guards/permissions.guard';
import { Permissions } from 'src/modules/authorization/presentation/http/decorators/permissions.decorator';

import { PERMISSIONS } from 'src/modules/authorization/domain/constants/permissions';

import { GetAllRolesUseCase } from 'src/modules/authorization/application/use-cases/get-all-roles/get-all-roles.use-case';

@Controller('admin/roles')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly getAllRoles: GetAllRolesUseCase) {}

  @Get()
  @Permissions(PERMISSIONS.ROLES_READ)
  async findAll() {
    const roles = await this.getAllRoles.execute();

    return {
      items: roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      })),
    };
  }
}
