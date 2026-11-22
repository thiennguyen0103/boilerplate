import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { IdGeneratorPort } from 'src/modules/auth/application/ports/id-generator.port';

@Injectable()
export class UuidIdGeneratorAdapter implements IdGeneratorPort {
  generate(): string {
    return randomUUID();
  }
}
