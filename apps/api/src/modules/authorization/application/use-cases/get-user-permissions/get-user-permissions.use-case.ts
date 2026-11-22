import { UserRoleRepositoryPort } from 'src/modules/authorization/application/ports/user-role.repository.port';

export class GetUserPermissionsUseCase {
  constructor(private readonly userRoles: UserRoleRepositoryPort) {}

  execute(userId: string): Promise<string[]> {
    return this.userRoles.findPermissionsByUserId(userId);
  }
}
