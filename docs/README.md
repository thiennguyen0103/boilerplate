# Documentation

This directory contains the technical documentation and project-specific documentation for this application.

## Documentation structure

| Directory         | Purpose                                               |
| ----------------- | ----------------------------------------------------- |
| `architecture/`   | System architecture and architectural principles      |
| `backend/`        | NestJS backend conventions and development guidelines |
| `frontend/`       | Next.js frontend architecture and conventions         |
| `admin/`          | React admin application guidelines                    |
| `database/`       | PostgreSQL and TypeORM conventions                    |
| `authentication/` | Authentication, sessions, and security                |
| `testing/`        | Testing strategy and testing guidelines               |
| `infrastructure/` | Docker, environment variables, CI/CD, deployment      |
| `development/`    | Local development and engineering workflows           |
| `project/`        | Business requirements and project-specific decisions  |

## Recommended reading order

1. `architecture/overview.md`
2. `architecture/backend-architecture.md`
3. `architecture/frontend-architecture.md`
4. `architecture/admin-architecture.md`
5. `architecture/clean-architecture.md`
6. `development/getting-started.md`
7. `development/coding-conventions.md`
8. `testing/testing-strategy.md`
9. `infrastructure/environment-variables.md`

## Documentation principles

- Keep documentation aligned with the actual implementation.
- Update documentation when architectural decisions change.
- Avoid documenting implementation details that are no longer valid.
- Separate reusable engineering standards from project-specific business rules.
- Record significant architectural decisions in `project/architecture-decisions/`.
- Use examples that match the current repository structure.

## Project-specific documentation

The `project/` directory contains documents that must be completed for each new project.

Do not assume that example business rules, roles, permissions, or domain models apply to every project.
