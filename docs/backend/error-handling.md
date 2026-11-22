# Error Handling

## Principles

- Handle expected errors explicitly.
- Use domain errors for business rule violations.
- Translate application errors into HTTP responses at the presentation boundary.
- Log unexpected errors with appropriate context.
- Never expose internal stack traces in production.

## Error Categories

| Category       | Example                       |
| -------------- | ----------------------------- |
| Validation     | Invalid request payload       |
| Authentication | Missing or invalid session    |
| Authorization  | Insufficient permissions      |
| Domain         | Business rule violation       |
| Persistence    | Database constraint violation |
| Infrastructure | External service unavailable  |
| Unexpected     | Unhandled application failure |

## HTTP Mapping

Map errors consistently to HTTP status codes.

Avoid returning raw exception messages from internal services.

## Logging

Include:

- Error identifier.
- Request or correlation ID.
- Relevant operation context.
- Stack trace for unexpected errors.

Never log passwords, session tokens, API keys, or other secrets.
