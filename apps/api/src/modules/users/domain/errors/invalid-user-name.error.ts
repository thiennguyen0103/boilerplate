export class InvalidUserNameError extends Error {
  constructor(message = 'Invalid user name') {
    super(message);
    this.name = 'INVALID_USER_NAME';
  }
}
