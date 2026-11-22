import type { UsersService } from 'src/modules/users/application/services/users.service';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';
import { InvalidCredentialsError } from 'src/modules/users/domain/errors/invalid-credentials.error';
import {
  makeUser,
  mockAccessTokens,
  mockIdGenerator,
  mockPasswordHasher,
  mockSessionRepository,
  mockTokenGenerator,
  mockUsersService,
} from 'src/testing/fixtures';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  const setup = () => {
    const users = mockUsersService();
    const passwordHasher = mockPasswordHasher();
    const accessTokens = mockAccessTokens();
    const tokenGenerator = mockTokenGenerator();
    const sessions = mockSessionRepository();
    const useCase = new LoginUseCase(
      users as unknown as UsersService,
      passwordHasher,
      accessTokens,
      tokenGenerator,
      sessions,
      mockIdGenerator(),
      30,
    );
    return { useCase, users, passwordHasher, accessTokens, sessions };
  };

  const input = { email: 'jane@example.com', password: 'correct-password' };

  it('creates a session storing only the refresh token hash', async () => {
    const { useCase, users, accessTokens, sessions } = setup();
    users.getByEmail.mockResolvedValue(makeUser());

    const result = await useCase.execute({ ...input, userAgent: 'jest' });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user).toEqual({
      id: 'user-1',
      email: 'jane@example.com',
      name: 'Jane Doe',
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });
    expect(accessTokens.sign).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'jane@example.com',
      sessionId: 'id-1',
    });
    expect(sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'id-1',
        userId: 'user-1',
        tokenHash: 'hash:refresh-token',
        userAgent: 'jest',
        ipAddress: null,
      }),
    );
  });

  it('sets the session expiry from the configured TTL', async () => {
    const { useCase, users, sessions } = setup();
    users.getByEmail.mockResolvedValue(makeUser());
    const before = Date.now();

    await useCase.execute(input);

    const { expiresAt } = sessions.create.mock.calls[0][0];
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + thirtyDays);
    expect(expiresAt.getTime()).toBeLessThanOrEqual(Date.now() + thirtyDays);
  });

  it('rejects an unknown email', async () => {
    const { useCase, users, sessions } = setup();
    users.getByEmail.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it('rejects a user without a password', async () => {
    const { useCase, users, passwordHasher } = setup();
    users.getByEmail.mockResolvedValue(makeUser({ passwordHash: null }));

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(passwordHasher.verify).not.toHaveBeenCalled();
  });

  it('rejects a wrong password', async () => {
    const { useCase, users, passwordHasher, sessions } = setup();
    users.getByEmail.mockResolvedValue(makeUser());
    passwordHasher.verify.mockResolvedValue(false);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it('rejects an inactive user with the same error as a wrong password', async () => {
    const { useCase, users, sessions } = setup();
    users.getByEmail.mockResolvedValue(makeUser({ status: UserStatus.BANNED }));

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(sessions.create).not.toHaveBeenCalled();
  });
});
