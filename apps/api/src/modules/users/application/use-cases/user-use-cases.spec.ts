import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';
import { InvalidEmailError } from 'src/modules/users/domain/errors/invalid-email.error';
import { InvalidUserNameError } from 'src/modules/users/domain/errors/invalid-user-name.error';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';
import { makeUser, mockUserRepository } from 'src/testing/fixtures';
import { ChangeUserStatusUseCase } from './change-user-status/change-user-status.use-case';
import { DeleteUserUseCase } from './delete-user/delete-user.use-case';
import { GetUserByEmailUseCase } from './get-user-by-email/get-user-by-email.use-case';
import { GetUserUseCase } from './get-user/get-user.use-case';
import { UpdateUserUseCase } from './update-user/update-user.use-case';

describe('GetUserUseCase', () => {
  it('returns the user', async () => {
    const repository = mockUserRepository();
    const user = makeUser();
    repository.findById.mockResolvedValue(user);

    await expect(
      new GetUserUseCase(repository).execute('user-1'),
    ).resolves.toBe(user);
  });

  it('throws when the user does not exist', async () => {
    const repository = mockUserRepository();
    repository.findById.mockResolvedValue(null);

    await expect(
      new GetUserUseCase(repository).execute('missing'),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});

describe('GetUserByEmailUseCase', () => {
  it('looks the user up by normalized email', async () => {
    const repository = mockUserRepository();
    repository.findByEmail.mockResolvedValue(null);

    await new GetUserByEmailUseCase(repository).execute({
      email: ' Jane@Example.com',
    });

    expect(repository.findByEmail).toHaveBeenCalledWith('jane@example.com');
  });

  it('rejects an invalid email without querying', async () => {
    const repository = mockUserRepository();

    await expect(
      new GetUserByEmailUseCase(repository).execute({ email: 'nope' }),
    ).rejects.toBeInstanceOf(InvalidEmailError);
    expect(repository.findByEmail).not.toHaveBeenCalled();
  });
});

describe('UpdateUserUseCase', () => {
  it('updates the name', async () => {
    const repository = mockUserRepository();
    repository.findById.mockResolvedValue(makeUser());

    await new UpdateUserUseCase(repository).execute({
      id: 'user-1',
      name: ' New Name ',
    });

    expect(repository.update).toHaveBeenCalledWith('user-1', {
      name: 'New Name',
    });
  });

  it('rejects an invalid name', async () => {
    const repository = mockUserRepository();
    repository.findById.mockResolvedValue(makeUser());

    await expect(
      new UpdateUserUseCase(repository).execute({ id: 'user-1', name: ' ' }),
    ).rejects.toBeInstanceOf(InvalidUserNameError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('throws when the user does not exist', async () => {
    const repository = mockUserRepository();
    repository.findById.mockResolvedValue(null);

    await expect(
      new UpdateUserUseCase(repository).execute({
        id: 'missing',
        name: 'Name',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});

describe('ChangeUserStatusUseCase', () => {
  it('changes the status', async () => {
    const repository = mockUserRepository();
    repository.findById.mockResolvedValue(makeUser());

    await new ChangeUserStatusUseCase(repository).execute({
      id: 'user-1',
      status: UserStatus.BANNED,
    });

    expect(repository.changeStatus).toHaveBeenCalledWith(
      'user-1',
      UserStatus.BANNED,
    );
  });

  it('throws when the user does not exist', async () => {
    const repository = mockUserRepository();
    repository.findById.mockResolvedValue(null);

    await expect(
      new ChangeUserStatusUseCase(repository).execute({
        id: 'missing',
        status: UserStatus.BANNED,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
    expect(repository.changeStatus).not.toHaveBeenCalled();
  });
});

describe('DeleteUserUseCase', () => {
  it('deletes an existing user', async () => {
    const repository = mockUserRepository();
    repository.findById.mockResolvedValue(makeUser());

    await new DeleteUserUseCase(repository).execute('user-1');

    expect(repository.delete).toHaveBeenCalledWith('user-1');
  });

  it('throws when the user does not exist', async () => {
    const repository = mockUserRepository();
    repository.findById.mockResolvedValue(null);

    await expect(
      new DeleteUserUseCase(repository).execute('missing'),
    ).rejects.toBeInstanceOf(UserNotFoundError);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
