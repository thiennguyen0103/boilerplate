export class OAuthProviderAlreadyConnectedError extends Error {
  constructor() {
    super('OAuth provider already connected');
    this.name = 'OAUTH_PROVIDER_ALREADY_CONNECTED';
  }
}
