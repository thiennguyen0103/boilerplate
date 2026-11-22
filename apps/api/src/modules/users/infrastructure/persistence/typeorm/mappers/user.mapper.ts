import { User } from 'src/modules/users/domain/entities/user.entity';
import { Email } from 'src/modules/users/domain/value-objects/email.vo';
import { UserName } from 'src/modules/users/domain/value-objects/user-name.vo';
import type { UserOrmEntity } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.orm-entity';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return User.reconstitute({
      id: entity.id,
      email: Email.create(entity.email),
      passwordHash: entity.passwordHash,
      name: UserName.create(entity.name),
      status: entity.status,
      emailVerified: entity.emailVerified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(user: User): Partial<UserOrmEntity> {
    return {
      id: user.id,
      email: user.email.getValue(),
      passwordHash: user.passwordHash,
      name: user.name.getValue(),
      status: user.status,
      emailVerified: user.emailVerified,
      updatedAt: user.updatedAt,
    };
  }
}
