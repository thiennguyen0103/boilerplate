import { InvalidRefreshTokenError } from 'src/modules/auth/domain/errors/invalid-refresh-token.error';
import type { UsersService } from 'src/modules/users/application/services/users.service';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';
import {
  makeSession,
  makeUser,
  mockAccessTokens,
  mockSessionRepository,
  mockTokenGenerator,
  mockUsersService,
} from 'src/testing/fixtures';
import { RefreshUseCase } from './refresh.use-case';

describe('RefreshUseCase', () => {
  const setup = () => {
    const users = mockUsersService();
    const accessTokens = mockAccessTokens();
    const tokenGenerator = mockTokenGenerator();
    const sessions = mockSessionRepository();
    tokenGenerator.generate.mockReturnValue('next-token');
    const useCase = new RefreshUseCase(
      users as unknown as UsersService,
      accessTokens,
      tokenGenerator,
      sessions,
      30,
    );
    return { useCase, users, accessTokens, sessions };
  };

  const input = { refreshToken: 'current', userAgent: null, ipAddress: null };

  it('rotates the refresh token and issues a new access token', async () => {
    const { useCase, users, accessTokens, sessions } = setup();
    sessions.findByTokenHash.mockResolvedValue(makeSession());
    users.findById.mockResolvedValue(makeUser());
    sessions.rotate.mockResolvedValue(true);

    const result = await useCase.execute(input);

    expect(sessions.findByTokenHash).toHaveBeenCalledWith('hash:current');
    expect(sessions.rotate).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: 'session-1',
        currentTokenHash: 'hash:current',
        nextTokenHash: 'hash:next-token',
      }),
    );
    expect(accessTokens.sign).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'jane@example.com',
      sessionId: 'session-1',
    });
    expect(result.refreshToken).toBe('next-token');
    expect(result.accessToken).toBe('access-token');
  });

  it('revokes the session when an already rotated token is reused', async () => {
    const { useCase, sessions } = setup();
    sessions.findByTokenHash.mockResolvedValue(null);
    sessions.findSessionIdByUsedTokenHash.mockResolvedValue('session-1');
    sessions.findById.mockResolvedValue(makeSession());

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidRefreshTokenError,
    );
    expect(sessions.revoke).toHaveBeenCalledWith(
      'session-1',
      'user-1',
      expect.any(Date),
    );
    expect(sessions.rotate).not.toHaveBeenCalled();
  });

  it('rejects an unknown token without revoking anything', async () => {
    const { useCase, sessions } = setup();
    sessions.findByTokenHash.mockResolvedValue(null);
    sessions.findSessionIdByUsedTokenHash.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidRefreshTokenError,
    );
    expect(sessions.revoke).not.toHaveBeenCalled();
  });

  it.each([
    ['revoked', { revokedAt: new Date() }],
    ['expired', { expiresAt: new Date(Date.now() - 1000) }],
  ])('rejects a %s session', async (_label, overrides) => {
    const { useCase, users, sessions } = setup();
    sessions.findByTokenHash.mockResolvedValue(makeSession(overrides));

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidRefreshTokenError,
    );
    expect(users.findById).not.toHaveBeenCalled();
    expect(sessions.rotate).not.toHaveBeenCalled();
  });

  it('revokes the session of a user who is no longer active', async () => {
    const { useCase, users, sessions } = setup();
    sessions.findByTokenHash.mockResolvedValue(makeSession());
    users.findById.mockResolvedValue(makeUser({ status: UserStatus.BANNED }));

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidRefreshTokenError,
    );
    expect(sessions.revoke).toHaveBeenCalledWith(
      'session-1',
      'user-1',
      expect.any(Date),
    );
    expect(sessions.rotate).not.toHaveBeenCalled();
  });

  it('revokes the session when a concurrent request already rotated the token', async () => {
    const { useCase, users, accessTokens, sessions } = setup();
    sessions.findByTokenHash.mockResolvedValue(makeSession());
    users.findById.mockResolvedValue(makeUser());
    sessions.rotate.mockResolvedValue(false);
    sessions.findSessionIdByUsedTokenHash.mockResolvedValue('session-1');

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidRefreshTokenError,
    );
    expect(sessions.revoke).toHaveBeenCalledWith(
      'session-1',
      'user-1',
      expect.any(Date),
    );
    expect(accessTokens.sign).not.toHaveBeenCalled();
  });
});
