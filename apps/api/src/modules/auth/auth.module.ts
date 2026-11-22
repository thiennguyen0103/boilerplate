import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from '../users/application/services/users.service';
import { UsersModule } from '../users/users.module';
import { AUTH_TOKENS } from './auth.tokens';

import { AccessTokenPort } from './application/ports/access-token.port';
import { GoogleTokenVerifierPort } from './application/ports/google-token-verifier.port';
import { IdGeneratorPort } from './application/ports/id-generator.port';
import { OAuthAccountRepositoryPort } from './application/ports/oauth-account.repository.port';
import { PasswordHasherPort } from './application/ports/password-hasher.port';
import { RefreshSessionRepositoryPort } from './application/ports/refresh-session.repository.port';
import { TokenGeneratorPort } from './application/ports/token-generator.port';

import { GetCurrentUserUseCase } from './application/use-cases/get-current-user/get-current-user.use-case';
import { GoogleLoginUseCase } from './application/use-cases/google-login/google-login.use-case';
import { LinkGoogleAccountUseCase } from './application/use-cases/link-google-account.use-case/link-google-account.use-case';
import { ListSessionsUseCase } from './application/use-cases/list-sessions/list-sessions.use-case';
import { LoginUseCase } from './application/use-cases/login/login.use-case';
import { LogoutAllUseCase } from './application/use-cases/logout-all/logout-all.use-case';
import { LogoutUseCase } from './application/use-cases/logout/logout.use-case';
import { RefreshUseCase } from './application/use-cases/refresh/refresh.use-case';
import { RegisterUseCase } from './application/use-cases/register/register.use-case';
import { RevokeOtherSessionsUseCase } from './application/use-cases/revoke-other-sessions/revoke-other-sessions.use-case';
import { RevokeSessionUseCase } from './application/use-cases/revoke-session/revoke-session.use-case';
import { UnlinkGoogleAccountUseCase } from './application/use-cases/unlink-google-account.use-case/unlink-google-account.use-case';

import { Argon2PasswordHasherAdapter } from './infrastructure/crypto/argon2-password-hasher.adapter';
import { CryptoTokenGeneratorAdapter } from './infrastructure/crypto/crypto-token-generator.adapter';
import { JwtAccessTokenAdapter } from './infrastructure/crypto/jwt-access-token.adapter';
import { UuidIdGeneratorAdapter } from './infrastructure/crypto/uuid-id-generator.adapter';
import { SessionCleanupJob } from './infrastructure/jobs/session-cleanup.job';
import { GoogleTokenVerifierAdapter } from './infrastructure/oauth/google-token-verifier.adapter';
import { OAuthAccountOrmEntity } from './infrastructure/persistence/typeorm/entities/oauth-account.orm-entity';
import { RefreshSessionOrmEntity } from './infrastructure/persistence/typeorm/entities/refresh-session.orm-entity';
import { RefreshTokenHistoryOrmEntity } from './infrastructure/persistence/typeorm/entities/refresh-token-history.orm-entity';
import { OAuthAccountRepository } from './infrastructure/persistence/typeorm/repositories/oauth-account.repository';
import { RefreshSessionRepository } from './infrastructure/persistence/typeorm/repositories/refresh-session.repository';

import { AuthController } from './presentation/http/auth.controller';
import { AuthExceptionFilter } from './presentation/http/filters/auth-exception.filter';
import { AccessTokenGuard } from './presentation/http/guards/access-token.guard';
import { GetUserAuthorizationUseCase } from '../authorization/application/use-cases/get-user-authorization/get-user-authorization.use-case';

const REFRESH_TOKEN_TTL_DAYS = Symbol('REFRESH_TOKEN_TTL_DAYS');

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([
      OAuthAccountOrmEntity,
      RefreshSessionOrmEntity,
      RefreshTokenHistoryOrmEntity,
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    // Adapters
    {
      provide: AUTH_TOKENS.PASSWORD_HASHER,
      useClass: Argon2PasswordHasherAdapter,
    },
    {
      provide: AUTH_TOKENS.TOKEN_GENERATOR,
      useClass: CryptoTokenGeneratorAdapter,
    },
    {
      provide: AUTH_TOKENS.ACCESS_TOKEN,
      useClass: JwtAccessTokenAdapter,
    },
    {
      provide: AUTH_TOKENS.ID_GENERATOR,
      useClass: UuidIdGeneratorAdapter,
    },
    {
      provide: AUTH_TOKENS.GOOGLE_TOKEN_VERIFIER,
      useClass: GoogleTokenVerifierAdapter,
    },
    {
      provide: AUTH_TOKENS.REFRESH_SESSION_REPOSITORY,
      useClass: RefreshSessionRepository,
    },
    {
      provide: AUTH_TOKENS.OAUTH_ACCOUNT_REPOSITORY,
      useClass: OAuthAccountRepository,
    },
    {
      provide: REFRESH_TOKEN_TTL_DAYS,
      useFactory: (config: ConfigService) =>
        config.getOrThrow<number>('auth.refreshTokenTtlDays'),
      inject: [ConfigService],
    },

    // Use cases
    {
      provide: RegisterUseCase,
      useFactory: (
        users: UsersService,
        passwordHasher: PasswordHasherPort,
        accessToken: AccessTokenPort,
        tokenGenerator: TokenGeneratorPort,
        sessions: RefreshSessionRepositoryPort,
        idGenerator: IdGeneratorPort,
        refreshTokenTtlDays: number,
      ) =>
        new RegisterUseCase(
          users,
          passwordHasher,
          accessToken,
          tokenGenerator,
          sessions,
          idGenerator,
          refreshTokenTtlDays,
        ),
      inject: [
        UsersService,
        AUTH_TOKENS.PASSWORD_HASHER,
        AUTH_TOKENS.ACCESS_TOKEN,
        AUTH_TOKENS.TOKEN_GENERATOR,
        AUTH_TOKENS.REFRESH_SESSION_REPOSITORY,
        AUTH_TOKENS.ID_GENERATOR,
        REFRESH_TOKEN_TTL_DAYS,
      ],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        users: UsersService,
        passwordHasher: PasswordHasherPort,
        accessToken: AccessTokenPort,
        tokenGenerator: TokenGeneratorPort,
        sessions: RefreshSessionRepositoryPort,
        idGenerator: IdGeneratorPort,
        refreshTokenTtlDays: number,
      ) =>
        new LoginUseCase(
          users,
          passwordHasher,
          accessToken,
          tokenGenerator,
          sessions,
          idGenerator,
          refreshTokenTtlDays,
        ),
      inject: [
        UsersService,
        AUTH_TOKENS.PASSWORD_HASHER,
        AUTH_TOKENS.ACCESS_TOKEN,
        AUTH_TOKENS.TOKEN_GENERATOR,
        AUTH_TOKENS.REFRESH_SESSION_REPOSITORY,
        AUTH_TOKENS.ID_GENERATOR,
        REFRESH_TOKEN_TTL_DAYS,
      ],
    },
    {
      provide: GoogleLoginUseCase,
      useFactory: (
        googleVerifier: GoogleTokenVerifierPort,
        oauthAccounts: OAuthAccountRepositoryPort,
        users: UsersService,
        sessions: RefreshSessionRepositoryPort,
        accessTokens: AccessTokenPort,
        tokenGenerator: TokenGeneratorPort,
        idGenerator: IdGeneratorPort,
        refreshTokenTtlDays: number,
      ) =>
        new GoogleLoginUseCase(
          googleVerifier,
          oauthAccounts,
          users,
          sessions,
          accessTokens,
          tokenGenerator,
          idGenerator,
          refreshTokenTtlDays,
        ),
      inject: [
        AUTH_TOKENS.GOOGLE_TOKEN_VERIFIER,
        AUTH_TOKENS.OAUTH_ACCOUNT_REPOSITORY,
        UsersService,
        AUTH_TOKENS.REFRESH_SESSION_REPOSITORY,
        AUTH_TOKENS.ACCESS_TOKEN,
        AUTH_TOKENS.TOKEN_GENERATOR,
        AUTH_TOKENS.ID_GENERATOR,
        REFRESH_TOKEN_TTL_DAYS,
      ],
    },
    {
      provide: RefreshUseCase,
      useFactory: (
        users: UsersService,
        accessToken: AccessTokenPort,
        tokenGenerator: TokenGeneratorPort,
        sessions: RefreshSessionRepositoryPort,
        refreshTokenTtlDays: number,
      ) =>
        new RefreshUseCase(
          users,
          accessToken,
          tokenGenerator,
          sessions,
          refreshTokenTtlDays,
        ),
      inject: [
        UsersService,
        AUTH_TOKENS.ACCESS_TOKEN,
        AUTH_TOKENS.TOKEN_GENERATOR,
        AUTH_TOKENS.REFRESH_SESSION_REPOSITORY,
        REFRESH_TOKEN_TTL_DAYS,
      ],
    },
    {
      provide: LogoutUseCase,
      useFactory: (
        tokenGenerator: TokenGeneratorPort,
        sessions: RefreshSessionRepositoryPort,
      ) => new LogoutUseCase(tokenGenerator, sessions),
      inject: [
        AUTH_TOKENS.TOKEN_GENERATOR,
        AUTH_TOKENS.REFRESH_SESSION_REPOSITORY,
      ],
    },
    {
      provide: LogoutAllUseCase,
      useFactory: (sessions: RefreshSessionRepositoryPort) =>
        new LogoutAllUseCase(sessions),
      inject: [AUTH_TOKENS.REFRESH_SESSION_REPOSITORY],
    },
    {
      provide: GetCurrentUserUseCase,
      useFactory: (
        users: UsersService,
        authorization: GetUserAuthorizationUseCase,
      ) => new GetCurrentUserUseCase(users, authorization),
      inject: [UsersService],
    },
    {
      provide: ListSessionsUseCase,
      useFactory: (sessions: RefreshSessionRepositoryPort) =>
        new ListSessionsUseCase(sessions),
      inject: [AUTH_TOKENS.REFRESH_SESSION_REPOSITORY],
    },
    {
      provide: RevokeSessionUseCase,
      useFactory: (sessions: RefreshSessionRepositoryPort) =>
        new RevokeSessionUseCase(sessions),
      inject: [AUTH_TOKENS.REFRESH_SESSION_REPOSITORY],
    },
    {
      provide: RevokeOtherSessionsUseCase,
      useFactory: (sessions: RefreshSessionRepositoryPort) =>
        new RevokeOtherSessionsUseCase(sessions),
      inject: [AUTH_TOKENS.REFRESH_SESSION_REPOSITORY],
    },
    {
      provide: LinkGoogleAccountUseCase,
      useFactory: (
        googleVerifier: GoogleTokenVerifierPort,
        oauthAccounts: OAuthAccountRepositoryPort,
        users: UsersService,
        idGenerator: IdGeneratorPort,
      ) =>
        new LinkGoogleAccountUseCase(
          googleVerifier,
          oauthAccounts,
          users,
          idGenerator,
        ),
      inject: [
        AUTH_TOKENS.GOOGLE_TOKEN_VERIFIER,
        AUTH_TOKENS.OAUTH_ACCOUNT_REPOSITORY,
        UsersService,
        AUTH_TOKENS.ID_GENERATOR,
      ],
    },
    {
      provide: UnlinkGoogleAccountUseCase,
      useFactory: (
        oauthAccounts: OAuthAccountRepositoryPort,
        users: UsersService,
      ) => new UnlinkGoogleAccountUseCase(oauthAccounts, users),
      inject: [AUTH_TOKENS.OAUTH_ACCOUNT_REPOSITORY, UsersService],
    },
    SessionCleanupJob,
    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useExisting: AccessTokenGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
  ],
  exports: [AUTH_TOKENS.ACCESS_TOKEN, AccessTokenGuard],
})
export class AuthModule {}
