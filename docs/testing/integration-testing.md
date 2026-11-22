# Integration Testing

## Scope

Integration tests verify interactions between application components and infrastructure.

## Backend

Examples:

- Repository implementations.
- PostgreSQL queries.
- Database constraints.
- Transactions.
- Authentication integration.

Use a dedicated test database or isolated database environment.

## Frontend

Examples:

- API client behavior.
- Server-state interactions.
- Error handling.
- Data transformation.

## Guidelines

- Control external dependencies.
- Clean up test data.
- Avoid depending on test execution order.
- Verify both success and failure behavior.
