import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exists.error';
import { Email } from 'src/modules/users/domain/value-objects/email.vo';
import { UserName } from 'src/modules/users/domain/value-objects/user-name.vo';
import { UserRepositoryPort } from 'src/modules/users/application/ports/user.repository.port';

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash?: string | null;
  emailVerified?: boolean;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: CreateUserInput) {
    const email = Email.create(input.email);
    const name = UserName.create(input.name);

    const exists = await this.userRepository.existsByEmail(email.getValue());

    if (exists) {
      throw new EmailAlreadyExistsError(email.getValue());
    }

    return this.userRepository.create({
      email: email.getValue(),
      name: name.getValue(),
      passwordHash: input.passwordHash ?? null,
      emailVerified: input.emailVerified ?? false,
    });
  }
}
