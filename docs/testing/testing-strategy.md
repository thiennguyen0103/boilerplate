# Testing Strategy

## 1. Objectives

Testing verifies application behavior, architectural boundaries, and integration between components.

The project uses three main testing levels:

- Unit tests.
- Integration tests.
- End-to-end tests.

## 2. Unit Tests

Test isolated business logic and individual components.

Backend examples:

- Domain rules.
- Value objects.
- Application use cases.
- Input validation.

Frontend examples:

- Utility functions.
- Hooks.
- Components.
- Form behavior.

## 3. Integration Tests

Test collaboration between multiple components.

Backend examples:

- TypeORM repositories against PostgreSQL.
- Application services and database adapters.
- Authentication integration.
- External service adapters with controlled dependencies.

Frontend examples:

- API integration with controlled test servers.
- Query and mutation behavior.
- Form submission workflows.

## 4. E2E Tests

Test complete user workflows through application boundaries.

Examples:

- Authentication.
- Main customer workflows.
- Admin management workflows.
- Protected API endpoints.

## 5. Test Principles

- Tests must be repeatable.
- Tests must not depend on production data.
- Avoid shared mutable test state.
- Use isolated test databases where necessary.
- Keep tests focused and meaningful.
- Test failure scenarios, not only successful paths.

## 6. CI

CI runs lint, format check, type check, Jest unit tests, the health e2e test, and build. Integration tests are not part of CI yet.

## 7. Coverage

Prioritize critical business logic and high-risk workflows over achieving an arbitrary coverage percentage.
