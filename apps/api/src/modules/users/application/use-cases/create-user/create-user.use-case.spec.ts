import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exists.error';
import { InvalidEmailError } from 'src/modules/users/domain/errors/invalid-email.error';
import { InvalidUserNameError } from 'src/modules/users/domain/errors/invalid-user-name.error';
import { makeUser, mockUserRepository } from 'src/testing/fixtures';
import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase', () => {
  it('normalizes input and creates the user', async () => {
    const repository = mockUserRepository();
    repository.existsByEmail.mockResolvedValue(false);
    repository.create.mockResolvedValue(makeUser());

    await new CreateUserUseCase(repository).execute({
      email: '  Jane@Example.COM ',
      name: '  Jane Doe ',
    });

    expect(repository.existsByEmail).toHaveBeenCalledWith('jane@example.com');
    expect(repository.create).toHaveBeenCalledWith({
      email: 'jane@example.com',
      name: 'Jane Doe',
      passwordHash: null,
      emailVerified: false,
    });
  });

  it('rejects an email that already exists', async () => {
    const repository = mockUserRepository();
    repository.existsByEmail.mockResolvedValue(true);

    await expect(
      new CreateUserUseCase(repository).execute({
        email: 'jane@example.com',
        name: 'Jane Doe',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it.each([
    [
      'an invalid email',
      { email: 'not-an-email', name: 'Jane' },
      InvalidEmailError,
    ],
    [
      'a too short name',
      { email: 'jane@example.com', name: 'J' },
      InvalidUserNameError,
    ],
  ])('rejects %s', async (_label, input, errorType) => {
    const repository = mockUserRepository();

    await expect(
      new CreateUserUseCase(repository).execute(input),
    ).rejects.toBeInstanceOf(errorType);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
