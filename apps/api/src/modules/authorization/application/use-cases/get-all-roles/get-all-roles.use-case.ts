import { RoleRepositoryPort } from 'src/modules/authorization/application/ports/role.repository.port';

export class GetAllRolesUseCase {
  constructor(private readonly roles: RoleRepositoryPort) {}

  execute() {
    return this.roles.findAll();
  }
}
