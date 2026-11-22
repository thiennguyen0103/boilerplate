export class AccountNotActiveError extends Error {
  constructor() {
    super('Account not active');
    this.name = 'ACCOUNT_NOT_ACTIVE';
  }
}
