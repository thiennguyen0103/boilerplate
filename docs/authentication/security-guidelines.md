# Security Guidelines

## General

- Apply least privilege.
- Validate all untrusted input.
- Keep secrets out of source control.
- Use HTTPS in production.
- Keep dependencies updated.
- Review access control for every protected operation.

## Authentication

- Use the `auth` module for authentication. See `authentication-setup.md`.
- Protect the refresh token cookie.
- Never log credentials, access tokens, or refresh tokens.
- Apply rate limiting to sensitive authentication endpoints.

## Authorization

- Enforce authorization in the backend.
- Check resource ownership and scope.
- Do not trust frontend permission checks.

## Data Protection

- Return only required fields.
- Avoid exposing internal identifiers and sensitive metadata unnecessarily.
- Protect sensitive data at rest and in transit as appropriate.

## Application Security

Review the need for:

- CSRF protection.
- CORS restrictions.
- Content Security Policy.
- Security headers.
- Request size limits.
- Rate limiting.
- Dependency vulnerability scanning.

## Secrets

- Use environment variables or a secret manager.
- Provide safe example values in `.env.example`.
- Never commit production credentials.
