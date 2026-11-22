# Logging and Monitoring

## Logging Principles

- Use structured logs.
- Include timestamps and log levels.
- Include request or correlation IDs where possible.
- Keep logs useful for debugging and incident investigation.
- Avoid excessive logging.

## Sensitive Information

Never log:

- Passwords.
- Authentication tokens.
- Session cookies.
- API secrets.
- Full payment details.
- Sensitive personal data unless explicitly required and protected.

## Monitoring

Production systems should consider:

- Application health checks.
- Database connectivity.
- Error rates.
- Request latency.
- Resource usage.
- Background job failures.
- External service availability.

## Operational Readiness

Monitoring, alerting, log retention, and tracing should be configured according to the deployment environment.
