export class CannotRemoveLastLoginMethodError extends Error {
  constructor() {
    super('Cannot remove last login method');
    this.name = 'CANNOT_REMOVE_LAST_LOGIN_METHOD';
  }
}
