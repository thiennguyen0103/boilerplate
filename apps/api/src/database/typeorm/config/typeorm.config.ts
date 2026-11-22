import type { DataSourceOptions } from 'typeorm';

import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Configuration } from 'src/config/configuration';

type DatabaseConfig = Configuration['database'];

function createBaseTypeOrmConfig(database: DatabaseConfig): DataSourceOptions {
  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.name,
    ssl: database.ssl ? { rejectUnauthorized: true } : false,
    logging: database.logging,
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    extra: {
      min: database.pool.min,
      max: database.pool.max,
      connectionTimeoutMillis: database.connectTimeoutMs,
    },
  };
}

/**
 * NestJS runtime configuration.
 *
 * Entities are registered through TypeOrmModule.forFeature()
 * inside their respective feature modules.
 */
export function createTypeOrmRuntimeConfig(
  database: DatabaseConfig,
): TypeOrmModuleOptions {
  return {
    ...createBaseTypeOrmConfig(database),
    autoLoadEntities: true,
  };
}

/**
 * TypeORM CLI configuration.
 *
 * The CLI cannot use NestJS autoLoadEntities.
 * It needs explicit entity and migration paths.
 */
export function createTypeOrmCliConfig(
  database: DatabaseConfig,
): DataSourceOptions {
  return {
    ...createBaseTypeOrmConfig(database),
    entities: [`${__dirname}/../../../modules/**/*.orm-entity{.ts,.js}`],
    migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
    migrationsTableName: 'typeorm_migrations',
  };
}
