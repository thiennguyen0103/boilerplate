import { SetMetadata } from '@nestjs/common';
import { SystemRole } from 'src/modules/authorization/domain/constants/permissions';

export const ROLES_KEY = 'authorization:roles';

export const Roles = (...roles: SystemRole[]) => SetMetadata(ROLES_KEY, roles);
