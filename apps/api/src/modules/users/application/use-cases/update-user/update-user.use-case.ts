import { UserName } from 'src/modules/users/domain/value-objects/user-name.vo';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';
import { UserRepositoryPort } from 'src/modules/users/application/ports/user.repository.port';

export interface UpdateUserInput {
  id: string;
  name?: string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: UpdateUserInput) {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new UserNotFoundError(input.id);
    }

    if (input.name !== undefined) {
      user.updateName(UserName.create(input.name));
    }

    return this.userRepository.update(user.id, {
      name: user.name.getValue(),
    });
  }
}
