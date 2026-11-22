import type { GoogleIdentity } from 'src/modules/auth/application/ports/google-token-verifier.port';
import { InvalidGoogleTokenError } from 'src/modules/auth/application/errors/invalid-google-token.error';
import { InvalidOAuthAccountError } from 'src/modules/auth/domain/errors/invalid-oauth-account.error';
import { OAuthAccountAlreadyLinkedError } from 'src/modules/auth/domain/errors/oauth-account-already-linked.error';
import { OAuthAccountLinkRequiredError } from 'src/modules/auth/domain/errors/oauth-account-link-require.error';
import type { UsersService } from 'src/modules/users/application/services/users.service';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';
import { AccountNotActiveError } from 'src/modules/users/domain/errors/account-not-active.error';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exists.error';
import {
  makeOAuthAccount,
  makeUser,
  mockAccessTokens,
  mockGoogleVerifier,
  mockIdGenerator,
  mockOAuthAccountRepository,
  mockSessionRepository,
  mockTokenGenerator,
  mockUsersService,
} from 'src/testing/fixtures';
import { GoogleLoginUseCase } from './google-login.use-case';

describe('GoogleLoginUseCase', () => {
  const identity = (
    overrides: Partial<GoogleIdentity> = {},
  ): GoogleIdentity => ({
    subject: 'google-sub-1',
    email: 'jane@example.com',
    emailVerified: true,
    name: 'Jane Doe',
    picture: null,
    ...overrides,
  });

  const setup = (google: GoogleIdentity = identity()) => {
    const verifier = mockGoogleVerifier();
    const oauthAccounts = mockOAuthAccountRepository();
    const users = mockUsersService();
    const sessions = mockSessionRepository();
    verifier.verify.mockResolvedValue(google);
    const useCase = new GoogleLoginUseCase(
      verifier,
      oauthAccounts,
      users as unknown as UsersService,
      sessions,
      mockAccessTokens(),
      mockTokenGenerator(),
      mockIdGenerator(),
      30,
    );
    return { useCase, verifier, oauthAccounts, users, sessions };
  };

  const input = {
    idToken: 'google-id-token',
    userAgent: null,
    ipAddress: null,
  };

  it('signs in the user who owns an already linked Google account', async () => {
    const { useCase, oauthAccounts, users, sessions } = setup();
    oauthAccounts.findByProviderSubject.mockResolvedValue(makeOAuthAccount());
    users.findById.mockResolvedValue(makeUser());

    const result = await useCase.execute(input);

    expect(users.findById).toHaveBeenCalledWith('user-1');
    expect(users.create).not.toHaveBeenCalled();
    expect(oauthAccounts.create).not.toHaveBeenCalled();
    expect(sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1' }),
    );
    expect(result.refreshToken).toBe('refresh-token');
  });

  it('links Google to an existing user with a verified email', async () => {
    const { useCase, oauthAccounts, users } = setup();
    oauthAccounts.findByProviderSubject.mockResolvedValue(null);
    users.getByEmail.mockResolvedValue(makeUser({ emailVerified: true }));

    await useCase.execute(input);

    expect(users.create).not.toHaveBeenCalled();
    expect(oauthAccounts.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        provider: 'google',
        providerSubject: 'google-sub-1',
      }),
    );
  });

  it('requires explicit linking when the existing user email is unverified', async () => {
    const { useCase, oauthAccounts, users, sessions } = setup();
    oauthAccounts.findByProviderSubject.mockResolvedValue(null);
    users.getByEmail.mockResolvedValue(makeUser({ emailVerified: false }));

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      OAuthAccountLinkRequiredError,
    );
    expect(oauthAccounts.create).not.toHaveBeenCalled();
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it('creates a verified user and links Google when no user exists', async () => {
    const { useCase, oauthAccounts, users } = setup();
    oauthAccounts.findByProviderSubject.mockResolvedValue(null);
    users.getByEmail.mockResolvedValue(null);
    users.create.mockResolvedValue(makeUser());

    await useCase.execute(input);

    expect(users.create).toHaveBeenCalledWith({
      email: 'jane@example.com',
      name: 'Jane Doe',
      emailVerified: true,
    });
    expect(oauthAccounts.create).toHaveBeenCalled();
  });

  it.each([
    ['the email local part when Google has no name', { name: null }, 'jane'],
    [
      'the full email when the local part is too short',
      { name: null, email: 'j@example.com' },
      'j@example.com',
    ],
    ['a trimmed Google name', { name: '  Jane  ' }, 'Jane'],
  ])('names a new user with %s', async (_label, overrides, expectedName) => {
    const { useCase, oauthAccounts, users } = setup(identity(overrides));
    oauthAccounts.findByProviderSubject.mockResolvedValue(null);
    users.getByEmail.mockResolvedValue(null);
    users.create.mockResolvedValue(makeUser());

    await useCase.execute(input);

    expect(users.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: expectedName }),
    );
  });

  it('reuses the user a concurrent request created with the same email', async () => {
    const { useCase, oauthAccounts, users } = setup();
    oauthAccounts.findByProviderSubject.mockResolvedValue(null);
    users.getByEmail
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeUser({ id: 'user-2' }));
    users.create.mockRejectedValue(
      new EmailAlreadyExistsError('jane@example.com'),
    );

    const result = await useCase.execute(input);

    expect(result.user.id).toBe('user-2');
    expect(oauthAccounts.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-2' }),
    );
  });

  it('succeeds when a concurrent request linked the same account to the same user', async () => {
    const { useCase, oauthAccounts, users } = setup();
    oauthAccounts.findByProviderSubject
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeOAuthAccount({ userId: 'user-1' }));
    users.getByEmail.mockResolvedValue(makeUser());
    oauthAccounts.create.mockRejectedValue(
      new OAuthAccountAlreadyLinkedError(),
    );

    await expect(useCase.execute(input)).resolves.toBeDefined();
  });

  it('rejects when the Google account was linked to a different user concurrently', async () => {
    const { useCase, oauthAccounts, users, sessions } = setup();
    oauthAccounts.findByProviderSubject
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeOAuthAccount({ userId: 'someone-else' }));
    users.getByEmail.mockResolvedValue(makeUser());
    oauthAccounts.create.mockRejectedValue(
      new OAuthAccountAlreadyLinkedError(),
    );

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidOAuthAccountError,
    );
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it('rejects an inactive user', async () => {
    const { useCase, oauthAccounts, users, sessions } = setup();
    oauthAccounts.findByProviderSubject.mockResolvedValue(makeOAuthAccount());
    users.findById.mockResolvedValue(makeUser({ status: UserStatus.BANNED }));

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      AccountNotActiveError,
    );
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it('propagates an invalid Google token', async () => {
    const { useCase, verifier, oauthAccounts } = setup();
    verifier.verify.mockRejectedValue(new InvalidGoogleTokenError());

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvalidGoogleTokenError,
    );
    expect(oauthAccounts.findByProviderSubject).not.toHaveBeenCalled();
  });
});
