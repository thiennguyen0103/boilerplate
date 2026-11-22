import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { AccountNotActiveError } from 'src/modules/users/domain/errors/account-not-active.error';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exists.error';
import { InvalidCredentialsError } from 'src/modules/users/domain/errors/invalid-credentials.error';
import { InvalidEmailError } from 'src/modules/users/domain/errors/invalid-email.error';
import { InvalidUserNameError } from 'src/modules/users/domain/errors/invalid-user-name.error';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';

type ErrorClass = new (...args: never[]) => Error;

const STATUS_BY_ERROR = new Map<ErrorClass, HttpStatus>([
  [InvalidCredentialsError, HttpStatus.UNAUTHORIZED],
  [AccountNotActiveError, HttpStatus.FORBIDDEN],
  [UserNotFoundError, HttpStatus.NOT_FOUND],
  [EmailAlreadyExistsError, HttpStatus.CONFLICT],
  [InvalidEmailError, HttpStatus.BAD_REQUEST],
  [InvalidUserNameError, HttpStatus.BAD_REQUEST],
]);

@Catch(...STATUS_BY_ERROR.keys())
export class UsersExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost): void {
    const statusCode =
      STATUS_BY_ERROR.get(error.constructor as ErrorClass) ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    host.switchToHttp().getResponse<Response>().status(statusCode).json({
      statusCode,
      message: error.message,
      error: error.name,
    });
  }
}
