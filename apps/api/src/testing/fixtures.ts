/// <reference types="jest" />
import type { AccessTokenPort } from 'src/modules/auth/application/ports/access-token.port';
import type { GoogleTokenVerifierPort } from 'src/modules/auth/application/ports/google-token-verifier.port';
import type { IdGeneratorPort } from 'src/modules/auth/application/ports/id-generator.port';
import type { OAuthAccountRepositoryPort } from 'src/modules/auth/application/ports/oauth-account.repository.port';
import type { PasswordHasherPort } from 'src/modules/auth/application/ports/password-hasher.port';
import type { RefreshSessionRepositoryPort } from 'src/modules/auth/application/ports/refresh-session.repository.port';
import type { TokenGeneratorPort } from 'src/modules/auth/application/ports/token-generator.port';
import {
  OAuthAccount,
  OAuthAccountProps,
} from 'src/modules/auth/domain/entities/oauth-account.entity';
import {
  RefreshSession,
  RefreshSessionProps,
} from 'src/modules/auth/domain/entities/refresh-session.entity';
import type { UserRepositoryPort } from 'src/modules/users/application/ports/user.repository.port';
import type { UsersService } from 'src/modules/users/application/services/users.service';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';
import { Email } from 'src/modules/users/domain/value-objects/email.vo';
import { UserName } from 'src/modules/users/domain/value-objects/user-name.vo';

export type Mocked<T> = { [K in keyof T]: jest.Mock };

const DAY_MS = 24 * 60 * 60 * 1000;

export function makeUser(
  overrides: Partial<{
    id: string;
    email: string;
    name: string;
    passwordHash: string | null;
    status: UserStatus;
    emailVerified: boolean;
  }> = {},
): User {
  return User.reconstitute({
    id: overrides.id ?? 'user-1',
    email: Email.create(overrides.email ?? 'jane@example.com'),
    name: UserName.create(overrides.name ?? 'Jane Doe'),
    passwordHash:
      overrides.passwordHash === undefined ? 'hashed' : overrides.passwordHash,
    status: overrides.status ?? UserStatus.ACTIVE,
    emailVerified: overrides.emailVerified ?? true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  });
}

export function makeSession(
  overrides: Partial<RefreshSessionProps> = {},
): RefreshSession {
  return RefreshSession.reconstitute({
    id: 'session-1',
    userId: 'user-1',
    tokenHash: 'hash:current',
    expiresAt: new Date(Date.now() + DAY_MS),
    revokedAt: null,
    lastUsedAt: null,
    userAgent: null,
    ipAddress: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  });
}

export function makeOAuthAccount(
  overrides: Partial<OAuthAccountProps> = {},
): OAuthAccount {
  return OAuthAccount.reconstitute({
    id: 'oauth-1',
    userId: 'user-1',
    provider: 'google',
    providerSubject: 'google-sub-1',
    email: 'jane@example.com',
    emailVerified: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  });
}

export function mockUsersService(): Mocked<UsersService> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    getByEmail: jest.fn(),
    updateProfile: jest.fn(),
    changeStatus: jest.fn(),
    delete: jest.fn(),
    hasPassword: jest.fn(),
  };
}

export function mockUserRepository(): Mocked<UserRepositoryPort> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    existsByEmail: jest.fn(),
    update: jest.fn(),
    changeStatus: jest.fn(),
    delete: jest.fn(),
  };
}

export function mockSessionRepository(): Mocked<RefreshSessionRepositoryPort> {
  return {
    create: jest.fn(),
    findByTokenHash: jest.fn(),
    findById: jest.fn(),
    findSessionIdByUsedTokenHash: jest.fn(),
    listActiveByUserId: jest.fn(),
    listByUserId: jest.fn(),
    revoke: jest.fn(),
    revokeAllExcept: jest.fn(),
    revokeAllByUserId: jest.fn(),
    rotate: jest.fn(),
    deleteExpired: jest.fn(),
  };
}

export function mockOAuthAccountRepository(): Mocked<OAuthAccountRepositoryPort> {
  return {
    findByProviderSubject: jest.fn(),
    findByUserAndProvider: jest.fn(),
    create: jest.fn(),
    deleteByUserAndProvider: jest.fn(),
    countByUserId: jest.fn(),
  };
}

export function mockPasswordHasher(): Mocked<PasswordHasherPort> {
  return {
    hash: jest.fn().mockResolvedValue('hashed'),
    verify: jest.fn().mockResolvedValue(true),
  };
}

export function mockAccessTokens(): Mocked<AccessTokenPort> {
  return {
    sign: jest.fn().mockResolvedValue('access-token'),
    verify: jest.fn(),
  };
}

export function mockTokenGenerator(): Mocked<TokenGeneratorPort> {
  return {
    generate: jest.fn().mockReturnValue('refresh-token'),
    hash: jest.fn((token: string) => `hash:${token}`),
  };
}

export function mockIdGenerator(): Mocked<IdGeneratorPort> {
  let counter = 0;
  return {
    generate: jest.fn(() => `id-${++counter}`),
  };
}

export function mockGoogleVerifier(): Mocked<GoogleTokenVerifierPort> {
  return { verify: jest.fn() };
}
