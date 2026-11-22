# AGENTS.md

# Project Engineering Standards

## Project Stack

- Monorepo: pnpm workspaces
- Customer frontend: Next.js App Router
- Admin frontend: React + Vite
- Backend: NestJS
- Backend architecture: Clean Architecture + Modular Monolith
- Authentication: custom `auth` module (JWT access tokens, rotating refresh tokens, Google sign-in). See `docs/authentication/authentication-setup.md`.
- ORM: TypeORM
- Database: PostgreSQL
- Linting: oxlint
- Testing: Jest. The starter has use-case unit tests and a health e2e test. Integration tests are not set up.

Nx is not used.

## Core Principles

1. Follow existing architecture and conventions.
2. Inspect before modifying.
3. Prefer simple, maintainable solutions.
4. Avoid unnecessary dependencies.
5. Do not invent business requirements.
6. Keep changes focused and minimal.
7. Update documentation when architecture or behavior changes.
8. Never claim checks passed without running them.

## Backend Standards

- Follow Clean Architecture.
- Keep controllers thin.
- Keep business logic in application use cases.
- Keep domain logic framework-independent.
- Define repository interfaces at appropriate inner boundaries.
- Keep TypeORM persistence in infrastructure.
- Validate all external input.
- Use DTOs for API contracts.
- Use database migrations for schema changes.
- Never use synchronize in production.

## Frontend Standards

- Organize code by feature.
- Prefer Server Components in Next.js.
- Use Client Components only when necessary.
- Separate API communication from UI components.
- Use TanStack Query for server state where appropriate.
- Use Zustand only when shared client state is needed.
- Use React Hook Form and Zod for forms.
- Those three frontend libraries are not installed. Add one when a feature needs it.
- Reuse existing components and design tokens.

## Testing Standards

- Unit test business logic.
- Integration test infrastructure boundaries.
- E2E test critical user workflows.
- Test success and failure scenarios.
- Do not weaken tests just to make them pass.

## Implementation Workflow

1. Understand the requirement.
2. Inspect existing code and documentation.
3. Identify affected modules.
4. Create an implementation plan.
5. Implement the smallest suitable change.
6. Run lint, type checks, and relevant tests.
7. Update documentation if necessary.
8. Report changes and verification results.

## Completion Report

Always include:

- What changed.
- Files created or modified.
- Tests and checks executed.
- Test results.
- Assumptions and unresolved issues.

# Clean Architecture Rules

## Domain

- Must not import NestJS.
- Must not import TypeORM.
- Must not import external infrastructure libraries.
- Must contain business rules and domain entities.

## Application

- Must not import TypeORM.
- Must not depend on NestJS decorators.
- Must depend on Domain and application ports only.
- Every use case must have a clear single responsibility.

## Infrastructure

- Implements application ports.
- Contains TypeORM entities and repositories.
- Contains external service adapters.
- Maps persistence models to domain entities.

## Presentation

- Contains controllers, DTOs, guards and HTTP decorators.
- Must not contain business logic.
- Must not access TypeORM repositories directly.
- Controllers must invoke use cases.

## Authentication

- Access tokens must be short-lived.
- Refresh tokens must be random, opaque and rotated.
- Refresh token hashes must be stored in the database.
- Tokens must not be stored in localStorage.
- Passwords must be hashed using Argon2id.
- Authentication cookies must be HttpOnly.
- Logout must revoke the relevant session.

## Authorization

- Authorization must be checked server-side.
- Use permissions rather than hardcoded role checks.
- Permission guards must not query repositories directly.

## Workflow

1. Define domain.
2. Define application contracts.
3. Implement use cases.
4. Implement infrastructure adapters.
5. Wire dependency injection.
6. Implement controllers.
7. Add migrations.
8. Add unit tests.
9. Add integration tests.
10. Run lint and typecheck.
