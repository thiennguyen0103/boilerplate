import type { UserRepositoryPort } from 'src/modules/users/application/ports/user.repository.port';
import { Email } from 'src/modules/users/domain/value-objects/email.vo';

export interface GetUserByEmailInput {
  email: string;
}

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: GetUserByEmailInput) {
    const email = Email.create(input.email);

    return this.userRepository.findByEmail(email.getValue());
  }
}
