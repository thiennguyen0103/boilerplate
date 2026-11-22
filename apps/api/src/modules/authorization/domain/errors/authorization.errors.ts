export abstract class AuthorizationError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class RoleNotFoundError extends AuthorizationError {
  constructor(roleId: string) {
    super(`Role not found: ${roleId}`);
  }
}

export class RoleNameAlreadyExistsError extends AuthorizationError {
  constructor(name: string) {
    super(`Role name already exists: ${name}`);
  }
}

export class UserNotFoundError extends AuthorizationError {
  constructor(userId: string) {
    super(`User not found: ${userId}`);
  }
}

export class UserRoleNotFoundError extends AuthorizationError {
  constructor(userId: string, roleId: string) {
    super(`User ${userId} does not have role ${roleId}`);
  }
}

export class SelfRoleAssignmentNotAllowedError extends AuthorizationError {
  constructor() {
    super('Self role assignment is not allowed');
  }
}

export class ProtectedRoleAssignmentError extends AuthorizationError {
  constructor() {
    super('This role cannot be assigned or removed through this operation');
  }
}

export class RoleAssignmentNotAllowedError extends AuthorizationError {
  constructor() {
    super('The actor is not allowed to assign this role');
  }
}

export class ProtectedRoleModificationError extends AuthorizationError {
  constructor() {
    super('System roles cannot be modified through this operation');
  }
}
