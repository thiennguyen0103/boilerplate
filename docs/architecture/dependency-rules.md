# Dependency Rules

## General Rules

1. Dependencies should point toward stable abstractions.
2. Avoid circular dependencies.
3. Avoid importing implementation details from unrelated modules.
4. Keep shared packages independent from application-specific business logic.
5. Do not use frontend packages inside the backend.
6. Do not use backend infrastructure packages inside frontend applications.

## Backend

- Domain must not import NestJS or TypeORM.
- Application must not depend on HTTP controllers.
- Infrastructure implements application/domain ports.
- Presentation calls application use cases.
- Modules communicate through explicit exported interfaces.

## Frontend

- Shared UI components must not depend on individual features.
- Features may use shared components and utilities.
- Generic components must not contain feature-specific business rules.
- API clients must not depend on page components.

## Shared Packages

Shared packages may contain:

- Shared TypeScript contracts.
- Reusable constants that are genuinely cross-application.
- Framework-independent utilities.

Avoid sharing:

- TypeORM entities.
- Backend domain entities.
- Database models.
- Server secrets.
- Application-specific business logic.
