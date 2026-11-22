import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Injectable,
  Inject,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from 'src/modules/authorization/presentation/http/decorators/permissions.decorator';

import { UserRoleRepositoryPort } from 'src/modules/authorization/application/ports/user-role.repository.port';
import { AUTHORIZATION_TOKENS } from 'src/modules/authorization/authorization.tokens';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    @Inject(AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY)
    private readonly userRoles: UserRoleRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No permission metadata means the endpoint
    // is not protected by this guard.
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const userPermissions =
      await this.userRoles.findPermissionsByUserId(userId);

    const allowed = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!allowed) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
