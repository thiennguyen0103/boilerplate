# Session Management

## Principles

- The `auth` module is the session authority. Sessions are rows in `refresh_sessions`.
- Do not implement a competing session mechanism without a documented requirement.
- Protect the refresh cookie.
- Use HTTPS in production.
- Handle expired and invalid sessions consistently with `401`.
- Never log access tokens, refresh tokens, or their hashes.

See `authentication-setup.md` for the token design.

## Session Verification

Protected backend endpoints must verify the access token.

Do not rely exclusively on frontend session state.

`AccessTokenGuard` is registered globally, so every route requires a valid `Bearer` access token by default. Mark a route or controller with `@Public()` to opt out. `health` and the sign-in, register, refresh and logout routes are public.

The authenticated user is available through `@CurrentUser()` as `{ id, email, sessionId }`.

## Cookie Configuration

The refresh cookie is:

- `HttpOnly`.
- `Secure` in production.
- `SameSite=Lax`.
- Scoped to `/<API_PREFIX>/auth`.
- Valid for `AUTH_REFRESH_TOKEN_TTL_DAYS`.

The access token is returned in the response body. Keep it in memory on the client.

## Logout

`POST /auth/logout` revokes the session that owns the refresh cookie and clears the cookie. `POST /auth/logout-all` revokes every session for the user.

## Testing

Test:

- Valid session.
- Missing session.
- Expired session.
- Invalid session.
- Refresh token rotation and reuse detection.
- Logout.
- Cross-origin cookie behavior where applicable.
