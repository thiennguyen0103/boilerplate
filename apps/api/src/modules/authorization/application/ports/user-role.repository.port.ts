import { Role } from 'src/modules/authorization/domain/entities/role.entity';

export interface UserRoleRepositoryPort {
  assign(
    userId: string,
    roleId: string,
    assignedBy: string | null,
  ): Promise<void>;
  remove(userId: string, roleId: string): Promise<boolean>;
  exists(userId: string, roleId: string): Promise<boolean>;
  findRolesByUserId(userId: string): Promise<Role[]>;
  findRoleNamesByUserId(userId: string): Promise<string[]>;
  findPermissionsByUserId(userId: string): Promise<string[]>;
}
