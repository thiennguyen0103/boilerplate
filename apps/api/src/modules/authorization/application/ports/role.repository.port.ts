import { Role } from '../../domain/entities/role.entity';

export interface CreateRoleData {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
}

export interface RoleRepositoryPort {
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  create(data: CreateRoleData): Promise<Role>;
  delete(id: string): Promise<boolean>;
}
