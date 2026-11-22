import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import { PermissionsGuard } from './permissions.guard';

describe('PermissionsGuard', () => {
  const userRoleRepository = {
    findPermissionsByUserId: jest.fn(),
  };

  const reflector = {
    getAllAndOverride: jest.fn(),
  };

  let guard: PermissionsGuard;

  beforeEach(() => {
    jest.clearAllMocks();

    guard = new PermissionsGuard(
      reflector as never,
      userRoleRepository as never,
    );
  });

  const createContext = (user?: { id: string }) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    }) as never;

  it('should allow when no permissions are required', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    await expect(
      guard.canActivate(createContext({ id: 'user-1' })),
    ).resolves.toBe(true);

    expect(userRoleRepository.findPermissionsByUserId).not.toHaveBeenCalled();
  });

  it('should throw 401 when user is missing', async () => {
    reflector.getAllAndOverride.mockReturnValue(['users:read']);

    await expect(guard.canActivate(createContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow when user has all permissions', async () => {
    reflector.getAllAndOverride.mockReturnValue(['users:read', 'users:update']);

    userRoleRepository.findPermissionsByUserId.mockResolvedValue([
      'users:read',
      'users:update',
    ]);

    await expect(
      guard.canActivate(createContext({ id: 'user-1' })),
    ).resolves.toBe(true);
  });

  it('should throw 403 when permission is missing', async () => {
    reflector.getAllAndOverride.mockReturnValue(['users:read', 'users:delete']);

    userRoleRepository.findPermissionsByUserId.mockResolvedValue([
      'users:read',
    ]);

    await expect(
      guard.canActivate(createContext({ id: 'user-1' })),
    ).rejects.toThrow(ForbiddenException);
  });
});
