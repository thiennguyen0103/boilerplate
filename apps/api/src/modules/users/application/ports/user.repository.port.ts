import type { User } from 'src/modules/users/domain/entities/user.entity';
import type { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';

export interface CreateUserData {
  email: string;
  name: string;
  passwordHash: string | null;
  emailVerified?: boolean;
}

export interface UpdateUserData {
  name?: string;
}

export interface UserRepositoryPort {
  create(data: CreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  update(id: string, data: UpdateUserData): Promise<User | null>;
  changeStatus(id: string, status: UserStatus): Promise<User | null>;
  delete(id: string): Promise<void>;
}
