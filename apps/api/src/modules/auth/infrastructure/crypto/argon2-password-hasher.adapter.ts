import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { PasswordHasherPort } from 'src/modules/auth/application/ports/password-hasher.port';

@Injectable()
export class Argon2PasswordHasherAdapter implements PasswordHasherPort {
  async hash(plainText: string): Promise<string> {
    return argon2.hash(plainText, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  async verify(hashedPassword: string, plainText: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainText);
    } catch {
      return false;
    }
  }
}
