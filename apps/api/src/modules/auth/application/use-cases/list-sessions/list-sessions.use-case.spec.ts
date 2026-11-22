import { makeSession, mockSessionRepository } from 'src/testing/fixtures';
import { ListSessionsUseCase } from './list-sessions.use-case';

describe('ListSessionsUseCase', () => {
  it('lists active sessions and flags the current one', async () => {
    const sessions = mockSessionRepository();
    sessions.listActiveByUserId.mockResolvedValue([
      makeSession({ id: 'session-1' }),
      makeSession({ id: 'session-2', userAgent: 'Firefox' }),
    ]);
    const useCase = new ListSessionsUseCase(sessions);

    const result = await useCase.execute({
      userId: 'user-1',
      currentSessionId: 'session-2',
    });

    expect(sessions.listActiveByUserId).toHaveBeenCalledWith('user-1');
    expect(result.map(({ id, isCurrent }) => ({ id, isCurrent }))).toEqual([
      { id: 'session-1', isCurrent: false },
      { id: 'session-2', isCurrent: true },
    ]);
    expect(result[1].userAgent).toBe('Firefox');
    expect(result[0]).not.toHaveProperty('tokenHash');
  });
});
