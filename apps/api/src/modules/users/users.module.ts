import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USERS_TOKENS } from './users.tokens';

import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { UserRepository } from './infrastructure/persistence/typeorm/repositories/user.repository';

import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user/get-user.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email/get-user-by-email.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user/update-user.use-case';
import { ChangeUserStatusUseCase } from './application/use-cases/change-user-status/change-user-status.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.use-case';

import { UsersService } from './application/services/users.service';
import { UsersController } from './presentation/http/users.controller';
import { UsersExceptionFilter } from './presentation/http/filters/users-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    UserRepository,
    {
      provide: APP_FILTER,
      useClass: UsersExceptionFilter,
    },
    {
      provide: USERS_TOKENS.USER_REPOSITORY,
      useExisting: UserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repository: UserRepository) =>
        new CreateUserUseCase(repository),
      inject: [USERS_TOKENS.USER_REPOSITORY],
    },
    {
      provide: GetUserUseCase,
      useFactory: (repository: UserRepository) =>
        new GetUserUseCase(repository),
      inject: [USERS_TOKENS.USER_REPOSITORY],
    },
    {
      provide: GetUserByEmailUseCase,
      useFactory: (repository: UserRepository) =>
        new GetUserByEmailUseCase(repository),
      inject: [USERS_TOKENS.USER_REPOSITORY],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repository: UserRepository) =>
        new UpdateUserUseCase(repository),
      inject: [USERS_TOKENS.USER_REPOSITORY],
    },
    {
      provide: ChangeUserStatusUseCase,
      useFactory: (repository: UserRepository) =>
        new ChangeUserStatusUseCase(repository),
      inject: [USERS_TOKENS.USER_REPOSITORY],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (repository: UserRepository) =>
        new DeleteUserUseCase(repository),
      inject: [USERS_TOKENS.USER_REPOSITORY],
    },
    {
      provide: UsersService,
      useFactory: (
        createUser: CreateUserUseCase,
        getUser: GetUserUseCase,
        getUserByEmail: GetUserByEmailUseCase,
        updateUser: UpdateUserUseCase,
        changeUserStatus: ChangeUserStatusUseCase,
        deleteUser: DeleteUserUseCase,
      ) =>
        new UsersService(
          createUser,
          getUser,
          getUserByEmail,
          updateUser,
          changeUserStatus,
          deleteUser,
        ),
      inject: [
        CreateUserUseCase,
        GetUserUseCase,
        GetUserByEmailUseCase,
        UpdateUserUseCase,
        ChangeUserStatusUseCase,
        DeleteUserUseCase,
      ],
    },
  ],
  exports: [
    UsersService,
    USERS_TOKENS.USER_REPOSITORY,
    GetUserByEmailUseCase,
    GetUserUseCase,
  ],
})
export class UsersModule {}
