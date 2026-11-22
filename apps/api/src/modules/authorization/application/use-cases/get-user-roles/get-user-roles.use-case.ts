import { UserRoleRepositoryPort } from 'src/modules/authorization/application/ports/user-role.repository.port';

export class GetUserRolesUseCase {
  constructor(private readonly userRoles: UserRoleRepositoryPort) {}

  execute(userId: string) {
    return this.userRoles.findRolesByUserId(userId);
  }
}
