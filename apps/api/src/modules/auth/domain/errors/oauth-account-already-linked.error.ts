export class OAuthAccountAlreadyLinkedError extends Error {
  constructor() {
    super('OAuth account already linked');
    this.name = 'OAUTH_ACCOUNT_ALREADY_LINKED';
  }
}
