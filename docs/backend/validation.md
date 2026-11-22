# Validation Guidelines

## Principles

- Validate data at application boundaries.
- Never trust frontend validation alone.
- Validate query parameters, route parameters, headers, and request bodies where applicable.
- Keep validation rules consistent with application requirements.

## Backend Validation

Use NestJS-compatible validation mechanisms for incoming HTTP DTOs.

Configure global validation to:

- Reject invalid input.
- Transform input only where intentional.
- Prevent unexpected properties from being accepted.
- Return consistent validation errors.

## Domain Validation

Domain invariants must also be enforced independently of HTTP validation.

This ensures that business rules remain valid when use cases are called from jobs, scripts, or other application modules.

## Testing

Test:

- Missing required values.
- Invalid formats.
- Boundary values.
- Unexpected properties.
- Domain invariant violations.
