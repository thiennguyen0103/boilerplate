# Environment Variables

## Principles

- Keep environment-specific configuration outside source code.
- Provide `.env.example` files with safe placeholder values.
- Never commit actual secrets.
- Validate required configuration at application startup.
- Document the purpose of each variable.

## Current files

Each app owns its environment. Copy `apps/api/.env.example`, `apps/web/.env.example`, and `apps/admin/.env.example` beside those apps. There is no shared env file at the repository root.

The API reads only `apps/api/.env`. Existing process variables win. `ConfigModule` validates that file with Zod in `apps/api/src/config/env.schema.ts` before the rest of the app boots. Nest code reads the nested result through `ConfigService` (`app`, `database`, `auth`, `cors`, and the groups below). The TypeORM CLI, run from the API package, loads the same file and calls the same validator. Invalid configuration throws before the process continues.

Blank or whitespace-only values are treated as unset. In production, `APP_URL`, `WEB_ORIGIN`, and `ADMIN_ORIGIN` must use HTTPS.

Local ports:

| App               | Port   |
| ----------------- | ------ |
| API               | `3000` |
| Customer frontend | `3001` |
| Admin frontend    | `3002` |

PostgreSQL in `docker-compose.yml` uses database `app`, user `app`, and password `app`. The API example uses those values.

### API

| Variable                                                                                             | Purpose                                                                                                       |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                                                                                           | `development`, `test`, or `production`. Default `development`                                                 |
| `APP_NAME`                                                                                           | API and OpenAPI title. Default `Boilerplate API`                                                              |
| `PORT`                                                                                               | API listen port, integer from 1 through 65535. Default `3000`. Read as `app.port`                             |
| `API_PREFIX`                                                                                         | Global route prefix, without a leading slash. Default `api/v1`. Read as `app.prefix`                          |
| `APP_URL`                                                                                            | Public API origin. Default `http://localhost:3000`                                                            |
| `TRUST_PROXY`                                                                                        | Express `trust proxy`: `true`, `false`, a hop count such as `1`, or an address list. Default unset (`false`)  |
| `DATABASE_HOST`                                                                                      | PostgreSQL host. Required                                                                                     |
| `DATABASE_PORT`                                                                                      | PostgreSQL port. Default `5432`                                                                               |
| `DATABASE_NAME`                                                                                      | PostgreSQL database name. Required                                                                            |
| `DATABASE_USER`                                                                                      | PostgreSQL user. Required                                                                                     |
| `DATABASE_PASSWORD`                                                                                  | PostgreSQL password. Required                                                                                 |
| `DATABASE_SSL`                                                                                       | `true` or `false`. Default `false`                                                                            |
| `DATABASE_LOGGING`                                                                                   | Log SQL when `true`. Default `false`                                                                          |
| `DATABASE_POOL_MIN`                                                                                  | TypeORM pool minimum. Default `2`. Cannot exceed `DATABASE_POOL_MAX`                                          |
| `DATABASE_POOL_MAX`                                                                                  | TypeORM pool maximum. Default `10`                                                                            |
| `DATABASE_CONNECT_TIMEOUT_MS`                                                                        | Connection timeout in milliseconds. Default `10000`                                                           |
| `AUTH_ACCESS_TOKEN_SECRET`                                                                           | Access token signing secret, at least 32 characters. Required                                                 |
| `AUTH_ACCESS_TOKEN_EXPIRES_IN`                                                                       | Access token lifetime, such as `15m`. Default `15m`                                                           |
| `AUTH_REFRESH_TOKEN_TTL_DAYS`                                                                        | Refresh session and cookie lifetime in days, 1 through 90. Default `30`                                       |
| `AUTH_REFRESH_TOKEN_COOKIE_NAME`                                                                     | Refresh token cookie name. Default `refresh_token`                                                            |
| `AUTH_ACCESS_TOKEN_COOKIE_NAME`, `AUTH_COOKIE_DOMAIN`, `AUTH_COOKIE_SECURE`, `AUTH_COOKIE_SAME_SITE` | Validated only. The API does not read them yet                                                                |
| `GOOGLE_CLIENT_ID`                                                                                   | Google OAuth client id. Optional; Google routes return `503` without it. Must be set together with the secret |
| `GOOGLE_CLIENT_SECRET`                                                                               | Google OAuth client secret. Optional                                                                          |
| `WEB_ORIGIN`                                                                                         | Customer app origin allowed by CORS. Required `http` or `https` URL                                           |
| `ADMIN_ORIGIN`                                                                                       | Admin origin allowed by CORS. Required `http` or `https` URL                                                  |
| `CORS_ALLOWED_ORIGINS`                                                                               | Extra comma-separated `http` or `https` origins. The web and admin origins are always included                |
| `LOG_LEVEL`                                                                                          | `fatal`, `error`, `warn`, `log`, `debug`, or `verbose`. Default `log`                                         |
| `LOG_PRETTY`                                                                                         | Pretty logging when `true`. Default `false`                                                                   |
| `RATE_LIMIT_TTL`                                                                                     | Global rate-limit window in milliseconds. Default `60000`                                                     |
| `RATE_LIMIT_MAX`                                                                                     | Requests allowed per client IP per window on every route. Default `100`                                       |
| `REDIS_ENABLED`                                                                                      | Require Redis settings when `true`. Default `false`. No module connects yet                                   |
| `REDIS_URL`                                                                                          | Redis connection URL. Required when Redis is enabled unless host and port are set                             |
| `REDIS_HOST`                                                                                         | Redis host. Used with `REDIS_PORT` when `REDIS_URL` is blank                                                  |
| `REDIS_PORT`                                                                                         | Redis port                                                                                                    |
| `REDIS_PASSWORD`                                                                                     | Redis password. Optional                                                                                      |
| `EMAIL_ENABLED`                                                                                      | Require SMTP settings when `true`. Default `false`. No mailer is configured yet                               |
| `EMAIL_FROM`                                                                                         | From address. Required when email is enabled                                                                  |
| `SMTP_HOST`                                                                                          | SMTP host. Required when email is enabled                                                                     |
| `SMTP_PORT`                                                                                          | SMTP port. Required when email is enabled                                                                     |
| `SMTP_USER`                                                                                          | SMTP user. Required when email is enabled                                                                     |
| `SMTP_PASSWORD`                                                                                      | SMTP password. Required when email is enabled                                                                 |
| `SMTP_SECURE`                                                                                        | Use TLS when `true`. Default `false`                                                                          |
| `STORAGE_PROVIDER`                                                                                   | `local` or `s3`. Default `local`. No storage module reads this yet                                            |
| `STORAGE_LOCAL_DIRECTORY`                                                                            | Local upload directory. Default `./uploads`                                                                   |
| `S3_REGION`                                                                                          | Required when `STORAGE_PROVIDER=s3`                                                                           |
| `S3_BUCKET`                                                                                          | Required when `STORAGE_PROVIDER=s3`                                                                           |
| `S3_ACCESS_KEY_ID`                                                                                   | Required when `STORAGE_PROVIDER=s3`                                                                           |
| `S3_SECRET_ACCESS_KEY`                                                                               | Required when `STORAGE_PROVIDER=s3`                                                                           |
| `S3_ENDPOINT`                                                                                        | Optional `http` or `https` S3 endpoint. Blank is unset                                                        |
| `S3_FORCE_PATH_STYLE`                                                                                | Path-style S3 URLs when `true`. Default `false`                                                               |

### Customer frontend

The Next.js app does not use the API schema. It reads:

| Variable              | Purpose                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Browser-visible API base URL, including `/api/v1`. The dev server is pinned to port `3001` |

Do not put `AUTH_ACCESS_TOKEN_SECRET` in the customer app environment. The browser bundle can only see `NEXT_PUBLIC_` variables, and the secret belongs on the API.

### Admin frontend

Vite serves the admin app on port `3002`. `VITE_API_URL` and `VITE_APP_NAME` are the public client settings. The starter dashboard does not read them yet. Vite exposes only `VITE_` variables to the browser.

## Security

- Use separate credentials for development, testing, and production.
- Use a secret manager in production where available.
- Rotate credentials when compromised.
- Do not expose server-only variables to browser bundles.

## Changes

When adding a new variable:

1. Add it to the relevant example environment file.
2. Add validation.
3. Document its purpose.
4. Update deployment configuration.
5. Verify behavior when the variable is missing.
