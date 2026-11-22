export class InvalidOAuthAccountError extends Error {
  constructor() {
    super('Invalid OAuth account');
    this.name = 'INVALID_OAUTH_ACCOUNT';
  }
}
