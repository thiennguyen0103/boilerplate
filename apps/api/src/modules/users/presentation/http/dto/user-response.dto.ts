import type { User } from 'src/modules/users/domain/entities/user.entity';
import type { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';

export class UserResponseDto {
  id!: string;
  email!: string;
  name!: string;
  status!: UserStatus;
  emailVerified!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static fromDomain(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email.getValue(),
      name: user.name.getValue(),
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
