import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { GoogleSignInNotConfiguredError } from 'src/modules/auth/application/errors/google-sign-in-not-configured.error';
import { InvalidGoogleTokenError } from 'src/modules/auth/application/errors/invalid-google-token.error';
import { CannotRemoveLastLoginMethodError } from 'src/modules/auth/domain/errors/cannot-remove-last-login-method.error';
import { InvalidOAuthAccountError } from 'src/modules/auth/domain/errors/invalid-oauth-account.error';
import { InvalidRefreshTokenError } from 'src/modules/auth/domain/errors/invalid-refresh-token.error';
import { OAuthAccountAlreadyLinkedError } from 'src/modules/auth/domain/errors/oauth-account-already-linked.error';
import { OAuthAccountLinkRequiredError } from 'src/modules/auth/domain/errors/oauth-account-link-require.error';
import { OAuthProviderAlreadyConnectedError } from 'src/modules/auth/domain/errors/oauth-provider-already-connected.error';

type ErrorClass = new (...args: never[]) => Error;

const STATUS_BY_ERROR = new Map<ErrorClass, HttpStatus>([
  [InvalidRefreshTokenError, HttpStatus.UNAUTHORIZED],
  [InvalidGoogleTokenError, HttpStatus.UNAUTHORIZED],
  [InvalidOAuthAccountError, HttpStatus.UNAUTHORIZED],
  [OAuthAccountLinkRequiredError, HttpStatus.CONFLICT],
  [OAuthAccountAlreadyLinkedError, HttpStatus.CONFLICT],
  [OAuthProviderAlreadyConnectedError, HttpStatus.CONFLICT],
  [CannotRemoveLastLoginMethodError, HttpStatus.CONFLICT],
  [GoogleSignInNotConfiguredError, HttpStatus.SERVICE_UNAVAILABLE],
]);

@Catch(...STATUS_BY_ERROR.keys())
export class AuthExceptionFilter implements ExceptionFilter {
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
