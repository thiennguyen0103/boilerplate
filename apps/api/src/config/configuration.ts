import type { Env } from './env.schema';

export function createConfiguration(env: Env) {
  return {
    app: {
      name: env.APP_NAME,
      description: env.APP_DESCRIPTION,
      environment: env.NODE_ENV,
      port: env.PORT,
      prefix: env.API_PREFIX,
      url: env.APP_URL,
      timezone: env.TIMEZONE,
      trustProxy: parseTrustProxy(env.TRUST_PROXY),
      isProduction: env.NODE_ENV === 'production',
      secureCookies: env.NODE_ENV === 'production',
    },
    database: {
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      name: env.DATABASE_NAME,
      username: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      ssl: env.DATABASE_SSL,
      logging: env.DATABASE_LOGGING,
      pool: {
        min: env.DATABASE_POOL_MIN,
        max: env.DATABASE_POOL_MAX,
      },
      connectTimeoutMs: env.DATABASE_CONNECT_TIMEOUT_MS,
    },
    auth: {
      accessTokenSecret: env.AUTH_ACCESS_TOKEN_SECRET,
      accessTokenExpiresIn: env.AUTH_ACCESS_TOKEN_EXPIRES_IN,
      refreshTokenTtlDays: env.AUTH_REFRESH_TOKEN_TTL_DAYS,
      cookies: {
        accessTokenName: env.AUTH_ACCESS_TOKEN_COOKIE_NAME,
        refreshTokenName: env.AUTH_REFRESH_TOKEN_COOKIE_NAME,
        domain: env.AUTH_COOKIE_DOMAIN,
        secure: env.AUTH_COOKIE_SECURE,
        sameSite: env.AUTH_COOKIE_SAME_SITE,
      },
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    cors: {
      webOrigin: env.WEB_ORIGIN,
      adminOrigin: env.ADMIN_ORIGIN,
      allowedOrigins: env.CORS_ALLOWED_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    },
    logging: {
      level: env.LOG_LEVEL,
      pretty: env.LOG_PRETTY,
    },
    rateLimit: {
      ttl: env.RATE_LIMIT_TTL,
      limit: env.RATE_LIMIT_MAX,
    },
    redis: {
      enabled: env.REDIS_ENABLED,
      url: env.REDIS_URL,
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      db: env.REDIS_DB,
    },
    email: {
      enabled: env.EMAIL_ENABLED,
      from: env.EMAIL_FROM,
      smtp: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        user: env.SMTP_USER,
        password: env.SMTP_PASSWORD,
        secure: env.SMTP_SECURE,
      },
    },
    storage: {
      provider: env.STORAGE_PROVIDER,
      localDirectory: env.STORAGE_LOCAL_DIRECTORY,
      s3: {
        region: env.S3_REGION,
        bucket: env.S3_BUCKET,
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        endpoint: env.S3_ENDPOINT,
        forcePathStyle: env.S3_FORCE_PATH_STYLE,
      },
    },
  } as const;
}

export type Configuration = ReturnType<typeof createConfiguration>;

/**
 * Maps TRUST_PROXY to an Express "trust proxy" value:
 * "true"/"false", a hop count such as "1", or a list such as "loopback, 10.0.0.0/8".
 */
function parseTrustProxy(value: string | undefined): boolean | number | string {
  if (!value || value === 'false') {
    return false;
  }

  if (value === 'true') {
    return true;
  }

  return /^\d+$/.test(value) ? Number(value) : value;
}
