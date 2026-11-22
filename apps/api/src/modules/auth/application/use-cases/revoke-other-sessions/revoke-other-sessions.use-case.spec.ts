import { InvalidRefreshTokenError } from 'src/modules/auth/domain/errors/invalid-refresh-token.error';
import { makeSession, mockSessionRepository } from 'src/testing/fixtures';
import { RevokeOtherSessionsUseCase } from './revoke-other-sessions.use-case';

describe('RevokeOtherSessionsUseCase', () => {
  const input = { userId: 'user-1', currentSessionId: 'session-1' };

  it('revokes every session except the current one', async () => {
    const sessions = mockSessionRepository();
    sessions.findById.mockResolvedValue(makeSession());
    sessions.revokeAllExcept.mockResolvedValue(3);

    const count = await new RevokeOtherSessionsUseCase(sessions).execute(input);

    expect(count).toBe(3);
    expect(sessions.revokeAllExcept).toHaveBeenCalledWith(
      'user-1',
      'session-1',
      expect.any(Date),
    );
  });

  it.each([
    ['is missing', null],
    ['belongs to another user', makeSession({ userId: 'user-2' })],
    ['is revoked', makeSession({ revokedAt: new Date() })],
  ])('rejects when the current session %s', async (_label, session) => {
    const sessions = mockSessionRepository();
    sessions.findById.mockResolvedValue(session);

    await expect(
      new RevokeOtherSessionsUseCase(sessions).execute(input),
    ).rejects.toBeInstanceOf(InvalidRefreshTokenError);
    expect(sessions.revokeAllExcept).not.toHaveBeenCalled();
  });
});
