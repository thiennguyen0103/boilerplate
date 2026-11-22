export class GoogleSignInNotConfiguredError extends Error {
  constructor() {
    super('Google sign-in is not configured');
    this.name = 'GOOGLE_SIGN_IN_NOT_CONFIGURED';
  }
}
