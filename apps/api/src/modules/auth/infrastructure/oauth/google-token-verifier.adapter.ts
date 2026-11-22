import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

import { GoogleSignInNotConfiguredError } from 'src/modules/auth/application/errors/google-sign-in-not-configured.error';
import { InvalidGoogleTokenError } from 'src/modules/auth/application/errors/invalid-google-token.error';
import {
  GoogleIdentity,
  GoogleTokenVerifierPort,
} from 'src/modules/auth/application/ports/google-token-verifier.port';

@Injectable()
export class GoogleTokenVerifierAdapter implements GoogleTokenVerifierPort {
  private readonly client = new OAuth2Client();
  private readonly clientId: string | undefined;

  constructor(private readonly config: ConfigService) {
    this.clientId = this.config.get<string>('auth.google.clientId');
  }

  async verify(idToken: string): Promise<GoogleIdentity> {
    if (!this.clientId) {
      throw new GoogleSignInNotConfiguredError();
    }

    let payload: TokenPayload | undefined;

    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw new InvalidGoogleTokenError();
    }

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new InvalidGoogleTokenError();
    }

    return {
      subject: payload.sub,
      email: payload.email,
      emailVerified: true,
      name: payload.name ?? null,
      picture: payload.picture ?? null,
    };
  }
}
