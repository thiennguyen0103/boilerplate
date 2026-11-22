import { UserRoleRepositoryPort } from 'src/modules/authorization/application/ports/user-role.repository.port';

export class GetUserAuthorizationUseCase {
  constructor(private readonly userRoles: UserRoleRepositoryPort) {}

  async execute(userId: string) {
    const [roles, permissions] = await Promise.all([
      this.userRoles.findRoleNamesByUserId(userId),
      this.userRoles.findPermissionsByUserId(userId),
    ]);

    return {
      roles,
      permissions,
    };
  }
}
