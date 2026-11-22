import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import {
  AccessTokenPayload,
  AccessTokenPort,
} from 'src/modules/auth/application/ports/access-token.port';

@Injectable()
export class JwtAccessTokenAdapter implements AccessTokenPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async sign(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('auth.accessTokenSecret'),
      expiresIn: this.configService.getOrThrow<string>(
        'auth.accessTokenExpiresIn',
      ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
      issuer: this.configService.getOrThrow<string>('app.name'),
      algorithm: 'HS256',
    });
  }

  async verify(token: string): Promise<AccessTokenPayload> {
    const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
      token,
      {
        secret: this.configService.getOrThrow<string>('auth.accessTokenSecret'),
        issuer: this.configService.getOrThrow<string>('app.name'),
        algorithms: ['HS256'],
      },
    );

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.sessionId !== 'string'
    ) {
      throw new Error('Invalid access token payload');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    };
  }
}
