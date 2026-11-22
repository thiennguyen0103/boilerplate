import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { RoleOrmEntity } from './infrastructure/persistence/typeorm/entities/role.orm-entity';
import { PermissionOrmEntity } from './infrastructure/persistence/typeorm/entities/permission.orm-entity';
import { UserRoleOrmEntity } from './infrastructure/persistence/typeorm/entities/user-role.orm-entity';
import { RolePermissionOrmEntity } from './infrastructure/persistence/typeorm/entities/role-permission.orm-entity';

import { RoleRepository } from './infrastructure/persistence/typeorm/repositories/role.repository';
import { PermissionRepository } from './infrastructure/persistence/typeorm/repositories/permission.repository';
import { UserRoleRepository } from './infrastructure/persistence/typeorm/repositories/user-role.repository';

import { RoleAssignmentPolicy } from './application/policies/role-assignment.policy';

import { GetAllRolesUseCase } from './application/use-cases/get-all-roles/get-all-roles.use-case';
import { GetUserRolesUseCase } from './application/use-cases/get-user-roles/get-user-roles.use-case';
import { GetUserPermissionsUseCase } from './application/use-cases/get-user-permissions/get-user-permissions.use-case';
import { GetUserAuthorizationUseCase } from './application/use-cases/get-user-authorization/get-user-authorization.use-case';
import { AssignRoleUseCase } from './application/use-cases/assign-role/assign-role.use-case';
import { RemoveRoleUseCase } from './application/use-cases/remove-role/remove-role.use-case';

import { PermissionsGuard } from './presentation/http/guards/permissions.guard';
import { RolesGuard } from './presentation/http/guards/roles.guard';

import { RolesController } from './presentation/http/controllers/roles.controller';
import { UserRolesController } from './presentation/http/controllers/user-roles.controller';

import { UsersService } from 'src/modules/users/application/services/users.service';
import { AUTHORIZATION_TOKENS } from './authorization.tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleOrmEntity,
      PermissionOrmEntity,
      UserRoleOrmEntity,
      RolePermissionOrmEntity,
    ]),
    AuthModule,
    UsersModule,
  ],

  controllers: [RolesController, UserRolesController],

  providers: [
    RoleAssignmentPolicy,

    {
      provide: AUTHORIZATION_TOKENS.ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
    {
      provide: AUTHORIZATION_TOKENS.PERMISSION_REPOSITORY,
      useClass: PermissionRepository,
    },
    {
      provide: AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY,
      useClass: UserRoleRepository,
    },

    {
      provide: GetAllRolesUseCase,
      useFactory: (roles) => new GetAllRolesUseCase(roles),
      inject: [AUTHORIZATION_TOKENS.ROLE_REPOSITORY],
    },

    {
      provide: GetUserRolesUseCase,
      useFactory: (userRoles) => new GetUserRolesUseCase(userRoles),
      inject: [AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY],
    },

    {
      provide: GetUserPermissionsUseCase,
      useFactory: (userRoles) => new GetUserPermissionsUseCase(userRoles),
      inject: [AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY],
    },

    {
      provide: GetUserAuthorizationUseCase,
      useFactory: (userRoles) => new GetUserAuthorizationUseCase(userRoles),
      inject: [AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY],
    },

    {
      provide: AssignRoleUseCase,
      useFactory: (roles, userRoles, users, policy) =>
        new AssignRoleUseCase(roles, userRoles, users, policy),
      inject: [
        AUTHORIZATION_TOKENS.ROLE_REPOSITORY,
        AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY,
        UsersService,
        RoleAssignmentPolicy,
      ],
    },

    {
      provide: RemoveRoleUseCase,
      useFactory: (roles, userRoles, users, policy) =>
        new RemoveRoleUseCase(roles, userRoles, users, policy),
      inject: [
        AUTHORIZATION_TOKENS.ROLE_REPOSITORY,
        AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY,
        UsersService,
        RoleAssignmentPolicy,
      ],
    },

    PermissionsGuard,
    RolesGuard,
  ],

  exports: [
    AUTHORIZATION_TOKENS.ROLE_REPOSITORY,
    AUTHORIZATION_TOKENS.PERMISSION_REPOSITORY,
    AUTHORIZATION_TOKENS.USER_ROLE_REPOSITORY,

    GetUserRolesUseCase,
    GetUserPermissionsUseCase,
    GetUserAuthorizationUseCase,

    PermissionsGuard,
    RolesGuard,
  ],
})
export class AuthorizationModule {}
