import type { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';
import type { UserRepositoryPort } from 'src/modules/users/application/ports/user.repository.port';

export interface ChangeUserStatusInput {
  id: string;
  status: UserStatus;
}

export class ChangeUserStatusUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: ChangeUserStatusInput) {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new UserNotFoundError(input.id);
    }

    user.changeStatus(input.status);

    return this.userRepository.changeStatus(user.id, user.status);
  }
}
