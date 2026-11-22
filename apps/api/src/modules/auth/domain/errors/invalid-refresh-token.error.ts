export class InvalidRefreshTokenError extends Error {
  constructor() {
    super('Invalid refresh token');
    this.name = 'INVALID_REFRESH_TOKEN';
  }
}
