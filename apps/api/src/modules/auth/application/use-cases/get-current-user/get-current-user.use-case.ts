import { GetUserAuthorizationUseCase } from 'src/modules/authorization/application/use-cases/get-user-authorization/get-user-authorization.use-case';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';

export class GetCurrentUserUseCase {
  constructor(
    private readonly users: UsersService,
    private readonly authorization: GetUserAuthorizationUseCase,
  ) {}

  async execute(userId: string) {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const authorization = await this.authorization.execute(userId);

    return {
      id: user.id,
      email: user.email.getValue(),
      name: user.name.getValue(),
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: authorization.roles,
      permissions: authorization.permissions,
    };
  }
}
