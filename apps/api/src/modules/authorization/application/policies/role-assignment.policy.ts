import {
  RoleAssignmentNotAllowedError,
  SelfRoleAssignmentNotAllowedError,
  ProtectedRoleAssignmentError,
} from 'src/modules/authorization/domain/errors/authorization.errors';

export interface RoleAssignmentContext {
  actorId: string;
  targetUserId: string;
  targetRoleName: string;
  actorRoleNames: string[];
}

export class RoleAssignmentPolicy {
  private readonly protectedRoles = new Set(['super_admin']);

  assertCanAssign(context: RoleAssignmentContext): void {
    if (context.actorId === context.targetUserId) {
      throw new SelfRoleAssignmentNotAllowedError();
    }

    if (this.protectedRoles.has(context.targetRoleName)) {
      throw new ProtectedRoleAssignmentError();
    }

    if (
      !context.actorRoleNames.includes('admin') &&
      !context.actorRoleNames.includes('super_admin')
    ) {
      throw new RoleAssignmentNotAllowedError();
    }
  }

  assertCanRemove(context: RoleAssignmentContext): void {
    if (context.actorId === context.targetUserId) {
      throw new SelfRoleAssignmentNotAllowedError();
    }

    if (this.protectedRoles.has(context.targetRoleName)) {
      throw new ProtectedRoleAssignmentError();
    }

    if (
      !context.actorRoleNames.includes('admin') &&
      !context.actorRoleNames.includes('super_admin')
    ) {
      throw new RoleAssignmentNotAllowedError();
    }
  }
}
