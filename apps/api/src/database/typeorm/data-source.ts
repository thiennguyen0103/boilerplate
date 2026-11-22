import 'reflect-metadata';

import { resolve } from 'node:path';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { validateEnv } from '../../config/env.validation';
import { createTypeOrmCliConfig } from './config/typeorm.config';

// Load apps/api/.env regardless of whether the CLI
// is running from src/ or compiled dist/.
dotenv.config({
  path: resolve(__dirname, '../../../.env'),
});

const env = validateEnv(process.env);

const dataSource = new DataSource(createTypeOrmCliConfig(env.database));

export default dataSource;
