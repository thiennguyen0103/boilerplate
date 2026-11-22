import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import type { Configuration } from '../../config/configuration';
import { createTypeOrmRuntimeConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const database =
          config.getOrThrow<Configuration['database']>('database');

        return createTypeOrmRuntimeConfig(database);
      },
    }),
  ],
})
export class TypeOrmDatabaseModule {}
