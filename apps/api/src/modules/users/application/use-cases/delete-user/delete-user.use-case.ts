import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';
import type { UserRepositoryPort } from 'src/modules/users/application/ports/user.repository.port';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    await this.userRepository.delete(userId);
  }
}
