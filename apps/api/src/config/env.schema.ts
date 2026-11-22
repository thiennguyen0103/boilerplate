import { z } from 'zod';

/**
 * Reusable environment validators
 */
const booleanEnv = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

const optionalString = z
  .string()
  .trim()
  .optional()
  .or(z.literal('').transform(() => undefined));

const optionalUrl = z
  .union([z.url(), z.literal('')])
  .optional()
  .transform((value) => value || undefined);

const portSchema = z.coerce.number().int().min(1).max(65535);

/**
 * Application
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  APP_NAME: z.string().trim().min(1).default('Boilerplate API'),
  APP_DESCRIPTION: z
    .string()
    .trim()
    .min(1)
    .default('NestJS Clean Architecture API'),
  PORT: portSchema.default(3000),
  API_PREFIX: z.string().trim().min(1).default('api/v1'),
  APP_URL: z.url().default('http://localhost:3000'),
  TIMEZONE: z.string().default('UTC'),
  TRUST_PROXY: optionalString,

  /**
   * Database
   */
  DATABASE_HOST: z.string().trim().min(1),
  DATABASE_PORT: portSchema.default(5432),
  DATABASE_NAME: z.string().trim().min(1),
  DATABASE_USER: z.string().trim().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_SSL: booleanEnv,
  DATABASE_LOGGING: booleanEnv,
  DATABASE_POOL_MIN: z.coerce.number().int().min(0).default(2),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(10),
  DATABASE_CONNECT_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(10000),

  // JWT
  AUTH_ACCESS_TOKEN_SECRET: z.string().min(32),
  AUTH_ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  AUTH_REFRESH_TOKEN_TTL_DAYS: z.coerce
    .number()
    .int()
    .min(1)
    .max(90)
    .default(30),

  // Cookies
  AUTH_ACCESS_TOKEN_COOKIE_NAME: z.string().default('access_token'),
  AUTH_REFRESH_TOKEN_COOKIE_NAME: z.string().default('refresh_token'),
  AUTH_COOKIE_DOMAIN: optionalString,
  AUTH_COOKIE_SECURE: booleanEnv,
  AUTH_COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),

  /**
   * Google OAuth
   */
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,

  /**
   * CORS
   */
  WEB_ORIGIN: z.url(),
  ADMIN_ORIGIN: z.url(),
  CORS_ALLOWED_ORIGINS: z.string().default(''),

  /**
   * Logging
   */
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'log', 'debug', 'verbose'])
    .default('log'),
  LOG_PRETTY: booleanEnv,

  /**
   * Rate limiting
   */
  RATE_LIMIT_TTL: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  /**
   * Redis - Optional
   */
  REDIS_ENABLED: booleanEnv,
  REDIS_URL: optionalUrl,
  REDIS_HOST: optionalString,
  REDIS_PORT: portSchema.optional(),
  REDIS_PASSWORD: optionalString,
  REDIS_DB: z.coerce.number().int().min(0).default(0),

  /**
   * Email - Optional
   */
  EMAIL_ENABLED: booleanEnv,
  EMAIL_FROM: optionalString,
  SMTP_HOST: optionalString,
  SMTP_PORT: portSchema.optional(),
  SMTP_USER: optionalString,
  SMTP_PASSWORD: optionalString,
  SMTP_SECURE: booleanEnv,

  /**
   * File storage
   */
  STORAGE_PROVIDER: z.enum(['local', 's3']).default('local'),
  STORAGE_LOCAL_DIRECTORY: z.string().default('./uploads'),
  S3_REGION: optionalString,
  S3_BUCKET: optionalString,
  S3_ACCESS_KEY_ID: optionalString,
  S3_SECRET_ACCESS_KEY: optionalString,
  S3_ENDPOINT: optionalUrl,
  S3_FORCE_PATH_STYLE: booleanEnv,
});

/**
 * Cross-field validation
 */
export const validatedEnvSchema = envSchema
  .refine((env) => env.DATABASE_POOL_MIN <= env.DATABASE_POOL_MAX, {
    message: 'DATABASE_POOL_MIN cannot exceed DATABASE_POOL_MAX',
    path: ['DATABASE_POOL_MIN'],
  })
  .refine(
    (env) =>
      Boolean(env.GOOGLE_CLIENT_ID) === Boolean(env.GOOGLE_CLIENT_SECRET),
    {
      message:
        'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be provided together',
      path: ['GOOGLE_CLIENT_SECRET'],
    },
  )
  .refine(
    (env) =>
      !env.REDIS_ENABLED ||
      Boolean(env.REDIS_URL) ||
      Boolean(env.REDIS_HOST && env.REDIS_PORT),
    {
      message:
        'REDIS_URL or both REDIS_HOST and REDIS_PORT are required when Redis is enabled',
      path: ['REDIS_URL'],
    },
  )
  .refine(
    (env) =>
      !env.EMAIL_ENABLED ||
      Boolean(
        env.EMAIL_FROM &&
        env.SMTP_HOST &&
        env.SMTP_PORT &&
        env.SMTP_USER &&
        env.SMTP_PASSWORD,
      ),
    {
      message: 'Email configuration is required when email is enabled',
      path: ['EMAIL_ENABLED'],
    },
  )
  .refine(
    (env) =>
      env.STORAGE_PROVIDER !== 's3' ||
      Boolean(
        env.S3_REGION &&
        env.S3_BUCKET &&
        env.S3_ACCESS_KEY_ID &&
        env.S3_SECRET_ACCESS_KEY,
      ),
    {
      message:
        'S3 credentials and bucket configuration are required when using S3',
      path: ['STORAGE_PROVIDER'],
    },
  )
  .refine(
    (env) =>
      env.NODE_ENV !== 'production' ||
      (env.APP_URL.startsWith('https://') &&
        env.WEB_ORIGIN.startsWith('https://') &&
        env.ADMIN_ORIGIN.startsWith('https://')),
    {
      message: 'Production application URLs must use HTTPS',
      path: ['APP_URL'],
    },
  );

export type Env = z.infer<typeof validatedEnvSchema>;
