import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { AccessTokenPort } from 'src/modules/auth/application/ports/access-token.port';
import { AUTH_TOKENS } from 'src/modules/auth/auth.tokens';
import { IS_PUBLIC_KEY } from 'src/modules/auth/presentation/http/decorators/public.decorator';

export interface AuthenticatedUser {
  id: string;
  email: string;
  sessionId: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    @Inject(AUTH_TOKENS.ACCESS_TOKEN)
    private readonly accessToken: AccessTokenPort,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;
    const bearerToken = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : null;

    const token = bearerToken;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.accessToken.verify(token);

      request.user = {
        id: payload.sub,
        email: payload.email,
        sessionId: payload.sessionId,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
