export class OAuthAccountLinkRequiredError extends Error {
  constructor() {
    super('OAuth account link required');
    this.name = 'OAUTH_ACCOUNT_LINK_REQUIRED';
  }
}
