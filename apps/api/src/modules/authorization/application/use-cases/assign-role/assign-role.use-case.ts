import { RoleRepositoryPort } from 'src/modules/authorization/application/ports/role.repository.port';
import { UserRoleRepositoryPort } from 'src/modules/authorization/application/ports/user-role.repository.port';
import { RoleAssignmentPolicy } from 'src/modules/authorization/application/policies/role-assignment.policy';

import {
  RoleNotFoundError,
  UserNotFoundError,
} from 'src/modules/authorization/domain/errors/authorization.errors';

import { UsersService } from 'src/modules/users/application/services/users.service';

export interface AssignRoleInput {
  userId: string;
  roleId: string;
  actorId: string;
}

export class AssignRoleUseCase {
  constructor(
    private readonly roles: RoleRepositoryPort,
    private readonly userRoles: UserRoleRepositoryPort,
    private readonly users: UsersService,
    private readonly policy: RoleAssignmentPolicy,
  ) {}

  async execute(input: AssignRoleInput): Promise<void> {
    const user = await this.users.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    const role = await this.roles.findById(input.roleId);

    if (!role) {
      throw new RoleNotFoundError(input.roleId);
    }

    const actorRoles = await this.userRoles.findRoleNamesByUserId(
      input.actorId,
    );

    this.policy.assertCanAssign({
      actorId: input.actorId,
      targetUserId: input.userId,
      targetRoleName: role.name,
      actorRoleNames: actorRoles,
    });

    // Repository is idempotent.
    await this.userRoles.assign(input.userId, role.id, input.actorId);
  }
}
