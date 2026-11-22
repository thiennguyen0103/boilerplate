import { UsersService } from 'src/modules/users/application/services/users.service';
import { OAuthAccountRepositoryPort } from '../../ports/oauth-account.repository.port';
import { AccountNotActiveError } from 'src/modules/users/domain/errors/account-not-active.error';
import { CannotRemoveLastLoginMethodError } from 'src/modules/auth/domain/errors/cannot-remove-last-login-method.error';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';

export class UnlinkGoogleAccountUseCase {
  constructor(
    private readonly oauthAccounts: OAuthAccountRepositoryPort,
    private readonly users: UsersService,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.users.findById(userId);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new AccountNotActiveError();
    }

    const googleAccount = await this.oauthAccounts.findByUserAndProvider(
      userId,
      'google',
    );

    if (!googleAccount) {
      return;
    }

    const hasPassword = await this.users.hasPassword(userId);

    const oauthAccountCount = await this.oauthAccounts.countByUserId(userId);

    if (!hasPassword && oauthAccountCount <= 1) {
      throw new CannotRemoveLastLoginMethodError();
    }

    await this.oauthAccounts.deleteByUserAndProvider(userId, 'google');
  }
}
