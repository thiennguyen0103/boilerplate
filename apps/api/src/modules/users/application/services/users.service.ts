import { ChangeUserStatusUseCase } from 'src/modules/users/application/use-cases/change-user-status/change-user-status.use-case';
import { CreateUserUseCase } from 'src/modules/users/application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from 'src/modules/users/application/use-cases/delete-user/delete-user.use-case';
import { GetUserByEmailUseCase } from 'src/modules/users/application/use-cases/get-user-by-email/get-user-by-email.use-case';
import { GetUserUseCase } from 'src/modules/users/application/use-cases/get-user/get-user.use-case';
import { UpdateUserUseCase } from 'src/modules/users/application/use-cases/update-user/update-user.use-case';

import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';

export class UsersService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly changeUserStatusUseCase: ChangeUserStatusUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async create(input: {
    email: string;
    name: string;
    passwordHash?: string | null;
    emailVerified?: boolean;
  }) {
    return this.createUserUseCase.execute(input);
  }

  async findById(id: string) {
    return this.getUserUseCase.execute(id);
  }

  async getByEmail(email: string) {
    return this.getUserByEmailUseCase.execute({ email });
  }

  async updateProfile(
    id: string,
    input: {
      name: string;
    },
  ) {
    return this.updateUserUseCase.execute({
      id,
      name: input.name,
    });
  }

  async changeStatus(id: string, status: UserStatus) {
    return this.changeUserStatusUseCase.execute({
      id,
      status,
    });
  }

  async delete(id: string) {
    return this.deleteUserUseCase.execute(id);
  }

  async hasPassword(id: string) {
    return this.getUserUseCase
      .execute(id)
      .then((user) => user?.passwordHash !== null);
  }
}
