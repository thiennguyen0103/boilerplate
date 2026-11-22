import type { UsersService } from 'src/modules/users/application/services/users.service';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exists.error';
import {
  makeUser,
  mockAccessTokens,
  mockIdGenerator,
  mockPasswordHasher,
  mockSessionRepository,
  mockTokenGenerator,
  mockUsersService,
} from 'src/testing/fixtures';
import { RegisterUseCase } from './register.use-case';

describe('RegisterUseCase', () => {
  const setup = () => {
    const users = mockUsersService();
    const passwordHasher = mockPasswordHasher();
    const sessions = mockSessionRepository();
    const useCase = new RegisterUseCase(
      users as unknown as UsersService,
      passwordHasher,
      mockAccessTokens(),
      mockTokenGenerator(),
      sessions,
      mockIdGenerator(),
      30,
    );
    return { useCase, users, passwordHasher, sessions };
  };

  const input = {
    email: 'jane@example.com',
    name: 'Jane Doe',
    password: 'a-long-password',
  };

  it('hashes the password, creates an unverified user and a session', async () => {
    const { useCase, users, passwordHasher, sessions } = setup();
    users.getByEmail.mockResolvedValue(null);
    users.create.mockResolvedValue(makeUser({ emailVerified: false }));

    const result = await useCase.execute(input);

    expect(passwordHasher.hash).toHaveBeenCalledWith('a-long-password');
    expect(users.create).toHaveBeenCalledWith({
      email: 'jane@example.com',
      name: 'Jane Doe',
      passwordHash: 'hashed',
      emailVerified: false,
    });
    expect(sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        tokenHash: 'hash:refresh-token',
      }),
    );
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user.emailVerified).toBe(false);
  });

  it('rejects an email that is already registered', async () => {
    const { useCase, users, passwordHasher, sessions } = setup();
    users.getByEmail.mockResolvedValue(makeUser());

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      EmailAlreadyExistsError,
    );
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(users.create).not.toHaveBeenCalled();
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it('does not create a session when user creation loses a race', async () => {
    const { useCase, users, sessions } = setup();
    users.getByEmail.mockResolvedValue(null);
    users.create.mockRejectedValue(
      new EmailAlreadyExistsError('jane@example.com'),
    );

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      EmailAlreadyExistsError,
    );
    expect(sessions.create).not.toHaveBeenCalled();
  });
});
