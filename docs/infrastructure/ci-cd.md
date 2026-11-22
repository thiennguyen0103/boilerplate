# CI/CD Guidelines

## Continuous Integration

`.github/workflows/ci.yml` runs, on pull requests and pushes to `main`:

- Dependency installation with a frozen lockfile.
- Linting.
- `pnpm format:check`.
- Type checking.
- Unit tests.
- The API health e2e test.
- Build output.

Integration tests are not configured. Add them here when a disposable PostgreSQL job exists.

## Continuous Delivery

Deployment pipelines should:

1. Build immutable artifacts.
2. Apply required database migrations in a controlled step.
3. Deploy the application.
4. Run health checks.
5. Verify critical functionality.
6. Support rollback or recovery procedures.

## Security

- Use protected deployment credentials.
- Avoid exposing secrets in logs.
- Restrict production deployment permissions.
- Pin dependencies and review updates.

## Project-Specific Configuration

Branch protections, environments, approval requirements, and deployment targets must be configured for each project.
