# Authentication Setup

## 1. Overview

The API implements authentication in the `auth` module (`apps/api/src/modules/auth`). There is no external auth framework.

- Short-lived JWT access tokens, sent as `Authorization: Bearer <token>`.
- Opaque, random refresh tokens, stored in an `HttpOnly` cookie and rotated on every refresh.
- Email and password sign-in, with Argon2id password hashing.
- Google sign-in with a Google ID token, plus linking and unlinking Google on an existing account.

The backend remains responsible for application-specific authorization.

## 2. Tokens

| Token         | Format          | Lifetime                               | Storage                                                  |
| ------------- | --------------- | -------------------------------------- | -------------------------------------------------------- |
| Access token  | HS256 JWT       | `AUTH_ACCESS_TOKEN_EXPIRES_IN` (`15m`) | Client memory only. Never `localStorage`                 |
| Refresh token | 64 random bytes | `AUTH_REFRESH_TOKEN_TTL_DAYS` (`30`)   | `HttpOnly` cookie; only its SHA-256 hash in the database |

The access token carries `sub` (user ID), `email`, and `sessionId`. It is signed with `AUTH_ACCESS_TOKEN_SECRET` and verified with the `APP_NAME` issuer.

The refresh cookie is named by `AUTH_REFRESH_TOKEN_COOKIE_NAME`, scoped to `/<API_PREFIX>/auth`, `SameSite=Lax`, and `Secure` in production.

## 3. Sessions

Each sign-in creates a row in `refresh_sessions`. Refreshing rotates the session's token hash and records the previous hash in `refresh_token_history`.

Presenting a refresh token that was already rotated is treated as theft: the session is revoked and the request fails with `401`.

Logout revokes the current session. Logout-all revokes every session for the user. Users can list their active sessions and revoke one or all others.

A daily job (`SessionCleanupJob`, 03:00) deletes expired sessions and their history. Revoked sessions are kept until they expire so reuse detection still works.

### Access token lifetime trade-off

Access tokens are not checked against the database. After logout, revocation, or a user being disabled, an already-issued access token stays valid until it expires (15 minutes by default). Refreshing fails immediately. Keep `AUTH_ACCESS_TOKEN_EXPIRES_IN` short. If a use case needs instant revocation, add a session check to `AccessTokenGuard`.

## 4. Route protection

`AccessTokenGuard` is registered globally. Every route requires a valid access token unless the route or controller is marked with `@Public()`.

Public routes: `GET /health`, `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `POST /auth/refresh`, `POST /auth/logout`.

## 5. Google sign-in

The client obtains a Google ID token and posts it to `POST /auth/google`. The API verifies it against `GOOGLE_CLIENT_ID` and requires `email_verified`.

- A Google account already linked to a user signs that user in.
- Otherwise, an existing user with the same email is linked only if that user's email is verified. Otherwise the API returns `409 OAUTH_ACCOUNT_LINK_REQUIRED`, and the user must sign in and link Google from their account.
- Otherwise, a new user is created with a verified email and no password.

When `GOOGLE_CLIENT_ID` is not set, Google routes return `503`.

## 6. Rate limiting

`ThrottlerGuard` applies `RATE_LIMIT_MAX` requests per `RATE_LIMIT_TTL` milliseconds to every route. Register, login, and Google sign-in are limited to 10 requests per minute per client IP.

The throttler stores counters in memory. Run a shared store such as Redis before scaling to more than one API instance. Behind a proxy, set `TRUST_PROXY` so limits and session IP addresses use the client IP.

## 7. Database

The `users`, `refresh_sessions`, `refresh_token_history`, and `oauth_accounts` tables are TypeORM entities managed by the migrations in `apps/api/src/database/typeorm/migrations`.

## 8. Production checklist

- [ ] Strong `AUTH_ACCESS_TOKEN_SECRET` (at least 32 characters) from a secret manager.
- [ ] HTTPS enabled, so the refresh cookie is `Secure`.
- [ ] CORS origins restricted.
- [ ] `TRUST_PROXY` set to match the load balancer.
- [ ] Shared rate-limit store if running more than one instance.
- [ ] Migrations applied.
- [ ] Email verification and password reset implemented if required. Neither exists yet.
