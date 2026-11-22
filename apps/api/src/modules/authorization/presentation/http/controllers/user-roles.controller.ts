import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard } from 'src/modules/auth/presentation/http/guards/access-token.guard';

import { CurrentUser } from 'src/modules/auth/presentation/http/decorators/current-user.decorator';

import { PermissionsGuard } from 'src/modules/authorization/presentation/http/guards/permissions.guard';
import { Permissions } from 'src/modules/authorization/presentation/http/decorators/permissions.decorator';

import { PERMISSIONS } from 'src/modules/authorization/domain/constants/permissions';

import { AssignRoleUseCase } from 'src/modules/authorization/application/use-cases/assign-role/assign-role.use-case';
import { RemoveRoleUseCase } from 'src/modules/authorization/application/use-cases/remove-role/remove-role.use-case';
import { GetUserRolesUseCase } from 'src/modules/authorization/application/use-cases/get-user-roles/get-user-roles.use-case';
import { GetUserPermissionsUseCase } from 'src/modules/authorization/application/use-cases/get-user-permissions/get-user-permissions.use-case';

import { AssignRoleDto } from 'src/modules/authorization/presentation/http/dto/assign-role.dto';

@Controller('admin/users/:userId')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class UserRolesController {
  constructor(
    private readonly assignRole: AssignRoleUseCase,
    private readonly removeRole: RemoveRoleUseCase,
    private readonly getUserRoles: GetUserRolesUseCase,
    private readonly getUserPermissions: GetUserPermissionsUseCase,
  ) {}

  @Get('roles')
  @Permissions(PERMISSIONS.ROLES_READ)
  async getRoles(@Param('userId') userId: string) {
    const roles = await this.getUserRoles.execute(userId);

    return {
      items: roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      })),
    };
  }

  @Get('permissions')
  @Permissions(PERMISSIONS.ROLES_READ)
  async getPermissions(@Param('userId') userId: string) {
    const permissions = await this.getUserPermissions.execute(userId);

    return {
      items: permissions,
    };
  }

  @Post('roles')
  @Permissions(PERMISSIONS.ROLES_ASSIGN)
  async assign(
    @Param('userId') userId: string,
    @Body() dto: AssignRoleDto,
    @CurrentUser() actor: { id: string },
  ) {
    await this.assignRole.execute({
      userId,
      roleId: dto.roleId,
      actorId: actor.id,
    });

    return {
      success: true,
    };
  }

  @Delete('roles/:roleId')
  @Permissions(PERMISSIONS.ROLES_ASSIGN)
  async remove(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @CurrentUser() actor: { id: string },
  ) {
    await this.removeRole.execute({
      userId,
      roleId,
      actorId: actor.id,
    });

    return {
      success: true,
    };
  }
}
