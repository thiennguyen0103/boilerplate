import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Injectable,
  Inject,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

import { UserRoleRepositoryPort } from 'src/modules/authorization/application/ports/user-role.repository.port';
import { AUTHORIZATION_TOKENS } from 'src/modules/authorization/authorization.tokens';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    @Inject(AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY)
    private readonly userRoles: UserRoleRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const userRoleNames = await this.userRoles.findRoleNamesByUserId(userId);

    const allowed = requiredRoles.some((role) => userRoleNames.includes(role));

    if (!allowed) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
