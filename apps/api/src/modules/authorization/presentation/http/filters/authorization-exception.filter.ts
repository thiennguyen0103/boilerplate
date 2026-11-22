import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import {
  RoleNotFoundError,
  UserNotFoundError,
  UserRoleNotFoundError,
  RoleNameAlreadyExistsError,
  SelfRoleAssignmentNotAllowedError,
  ProtectedRoleAssignmentError,
  RoleAssignmentNotAllowedError,
  ProtectedRoleModificationError,
} from 'src/modules/authorization/domain/errors/authorization.errors';

@Catch(
  RoleNotFoundError,
  UserNotFoundError,
  UserRoleNotFoundError,
  RoleNameAlreadyExistsError,
  SelfRoleAssignmentNotAllowedError,
  ProtectedRoleAssignmentError,
  RoleAssignmentNotAllowedError,
  ProtectedRoleModificationError,
)
export class AuthorizationExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();

    let status = HttpStatus.BAD_REQUEST;

    if (
      exception instanceof RoleNotFoundError ||
      exception instanceof UserNotFoundError ||
      exception instanceof UserRoleNotFoundError
    ) {
      status = HttpStatus.NOT_FOUND;
    }

    if (exception instanceof RoleNameAlreadyExistsError) {
      status = HttpStatus.CONFLICT;
    }

    if (
      exception instanceof SelfRoleAssignmentNotAllowedError ||
      exception instanceof ProtectedRoleAssignmentError ||
      exception instanceof RoleAssignmentNotAllowedError ||
      exception instanceof ProtectedRoleModificationError
    ) {
      status = HttpStatus.FORBIDDEN;
    }

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
