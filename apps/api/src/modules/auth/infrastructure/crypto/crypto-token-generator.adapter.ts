import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';

import { TokenGeneratorPort } from 'src/modules/auth/application/ports/token-generator.port';

@Injectable()
export class CryptoTokenGeneratorAdapter implements TokenGeneratorPort {
  generate(): string {
    return randomBytes(64).toString('base64url');
  }

  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
