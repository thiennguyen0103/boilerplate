import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common';

/**
 * Blocks administrative user operations until the authorization module
 * provides permission checks. Replace with a permission guard then.
 */
@Injectable()
export class RequiresPermissionsGuard implements CanActivate {
  canActivate(): boolean {
    throw new ForbiddenException(
      'This operation requires permissions that are not configured yet',
    );
  }
}
