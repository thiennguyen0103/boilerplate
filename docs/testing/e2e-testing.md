# End-to-End Testing

## Scope

E2E tests verify complete application workflows across system boundaries.

The only e2e test today is `apps/api/test/health.e2e-spec.ts`. It requests `GET /api/v1/health` and does not need PostgreSQL. Run it with `pnpm test:e2e`.

## Recommended Scenarios

- Authentication and logout.
- Protected customer routes.
- Main business workflows.
- Admin management operations.
- Authorization failures.
- Important error states.

## Guidelines

- Use a dedicated test environment.
- Use controlled test accounts and data.
- Avoid production services and data.
- Keep test workflows deterministic.
- Capture useful diagnostics when tests fail.

## CI

Run critical E2E workflows in CI where infrastructure and execution time permit.
