import { Injectable, Inject } from '@nestjs/common';

import { RoleRepositoryPort } from 'src/modules/authorization/application/ports/role.repository.port';

import { UserRoleRepositoryPort } from 'src/modules/authorization/application/ports/user-role.repository.port';
import { AUTHORIZATION_TOKENS } from 'src/modules/authorization/authorization.tokens';

@Injectable()
export class DefaultRoleAssignmentService {
  constructor(
    @Inject(AUTHORIZATION_TOKENS.ROLE_REPOSITORY)
    private readonly roles: RoleRepositoryPort,

    @Inject(AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY)
    private readonly userRoles: UserRoleRepositoryPort,
  ) {}

  async assignDefaultRole(userId: string): Promise<void> {
    const role = await this.roles.findByName('user');

    if (!role) {
      throw new Error('Default user role has not been seeded');
    }

    await this.userRoles.assign(userId, role.id, null);
  }
}
