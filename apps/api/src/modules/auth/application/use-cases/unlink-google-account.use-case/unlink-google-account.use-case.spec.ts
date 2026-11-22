import { CannotRemoveLastLoginMethodError } from 'src/modules/auth/domain/errors/cannot-remove-last-login-method.error';
import type { UsersService } from 'src/modules/users/application/services/users.service';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';
import { AccountNotActiveError } from 'src/modules/users/domain/errors/account-not-active.error';
import {
  makeOAuthAccount,
  makeUser,
  mockOAuthAccountRepository,
  mockUsersService,
} from 'src/testing/fixtures';
import { UnlinkGoogleAccountUseCase } from './unlink-google-account.use-case';

describe('UnlinkGoogleAccountUseCase', () => {
  const setup = () => {
    const oauthAccounts = mockOAuthAccountRepository();
    const users = mockUsersService();
    users.findById.mockResolvedValue(makeUser());
    const useCase = new UnlinkGoogleAccountUseCase(
      oauthAccounts,
      users as unknown as UsersService,
    );
    return { useCase, oauthAccounts, users };
  };

  it('unlinks Google when the user still has a password', async () => {
    const { useCase, oauthAccounts, users } = setup();
    oauthAccounts.findByUserAndProvider.mockResolvedValue(makeOAuthAccount());
    users.hasPassword.mockResolvedValue(true);
    oauthAccounts.countByUserId.mockResolvedValue(1);

    await useCase.execute('user-1');

    expect(oauthAccounts.deleteByUserAndProvider).toHaveBeenCalledWith(
      'user-1',
      'google',
    );
  });

  it('refuses to remove the last login method', async () => {
    const { useCase, oauthAccounts, users } = setup();
    oauthAccounts.findByUserAndProvider.mockResolvedValue(makeOAuthAccount());
    users.hasPassword.mockResolvedValue(false);
    oauthAccounts.countByUserId.mockResolvedValue(1);

    await expect(useCase.execute('user-1')).rejects.toBeInstanceOf(
      CannotRemoveLastLoginMethodError,
    );
    expect(oauthAccounts.deleteByUserAndProvider).not.toHaveBeenCalled();
  });

  it('does nothing when Google is not linked', async () => {
    const { useCase, oauthAccounts } = setup();
    oauthAccounts.findByUserAndProvider.mockResolvedValue(null);

    await useCase.execute('user-1');

    expect(oauthAccounts.deleteByUserAndProvider).not.toHaveBeenCalled();
  });

  it('rejects an inactive user', async () => {
    const { useCase, oauthAccounts, users } = setup();
    users.findById.mockResolvedValue(makeUser({ status: UserStatus.INACTIVE }));

    await expect(useCase.execute('user-1')).rejects.toBeInstanceOf(
      AccountNotActiveError,
    );
    expect(oauthAccounts.deleteByUserAndProvider).not.toHaveBeenCalled();
  });
});
