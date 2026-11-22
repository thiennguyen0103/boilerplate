import { Permission } from 'src/modules/authorization/domain/entities/permission.entity';

export interface PermissionRepositoryPort {
  findByCode(code: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
}
