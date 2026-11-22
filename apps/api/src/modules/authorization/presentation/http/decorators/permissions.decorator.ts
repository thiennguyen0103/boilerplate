import { SetMetadata } from '@nestjs/common';
import { PermissionCode } from 'src/modules/authorization/domain/constants/permissions';

export const PERMISSIONS_KEY = 'authorization:permissions';

export const Permissions = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
