# Full-stack Clean Architecture Boilerplate

Reusable pnpm-workspace monorepo:

- `apps/web`: Next.js App Router
- `apps/admin`: React + Vite admin shell
- `apps/api`: NestJS modular monolith with Clean Architecture
- `packages/shared-types`: types shared across apps
- `packages/config`, `packages/types`, `packages/ui`: empty placeholders for shared config, types, and UI
- PostgreSQL + TypeORM
- Email/password and Google authentication (JWT access tokens + rotating refresh tokens)
- oxlint, oxfmt, Docker Compose

## Prerequisites

- Node.js 22+
- pnpm 10+
- Docker + Docker Compose

## Quick start

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
pnpm install
docker compose up -d postgres
pnpm db:run
pnpm dev
```

Apps:

- Web: http://localhost:3001
- Admin: http://localhost:3002
- API: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/docs
- Health: http://localhost:3000/api/v1/health

## Configuration

Each app owns its environment file. There is no shared `.env` at the repository root.

The API reads `apps/api/.env` and validates it with Zod (`apps/api/src/config/env.schema.ts`) at startup. Invalid configuration stops the process before it boots. The TypeORM CLI loads the same file and runs the same validation.

CORS allows `WEB_ORIGIN`, `ADMIN_ORIGIN`, and any extra origins in `CORS_ALLOWED_ORIGINS`.

See [`docs/infrastructure/environment-variables.md`](docs/infrastructure/environment-variables.md) for every variable.

## Important authentication note

Authentication is implemented in the API's `auth` module. Every route requires a `Bearer` access token unless it is marked `@Public()`. Refresh tokens are rotated on every use and kept in an `HttpOnly` cookie; reusing an old one revokes the session. All auth tables are TypeORM entities managed by the regular migrations.

See [`docs/authentication/authentication-setup.md`](docs/authentication/authentication-setup.md).

## Architecture rules

1. Domain has no NestJS, TypeORM, HTTP, or other framework imports.
2. Application depends on domain contracts, not database implementations.
3. Infrastructure implements repository contracts.
4. Presentation translates HTTP requests/responses and calls use cases.
5. Nest modules are composition roots and wire dependency injection.
6. Cross-module access happens through exported application contracts, not direct ORM access.

## Useful commands

```bash
pnpm dev            # run api, web, and admin in parallel
pnpm build          # build every workspace
pnpm lint           # oxlint
pnpm typecheck      # tsc --noEmit in every workspace
pnpm test           # unit tests
pnpm test:e2e       # API e2e tests
pnpm format         # oxfmt
pnpm format:check   # oxfmt without writing

pnpm db:generate    # generate a migration from entity changes
pnpm db:create      # create an empty migration
pnpm db:run         # apply pending migrations
pnpm db:revert      # revert the last migration
pnpm db:show        # list migrations and their status
```

## Documentation

Engineering standards and project docs live in [`docs/`](docs/README.md). Start with [`docs/architecture/overview.md`](docs/architecture/overview.md).

## Production checklist

- Replace all example secrets.
- Configure exact CORS origins and trusted origins.
- Use HTTPS and secure cookies.
- Implement email verification and password reset if required, with SMTP delivery.
- Add rate limiting at the edge. The API's in-memory throttler needs a shared store before running more than one instance.
- Set `TRUST_PROXY` to match the load balancer.
- Configure database backups, monitoring, log retention and alerting.
- Review authorization policy per use case; authentication alone is not authorization.
- Add integration tests against a disposable PostgreSQL database.
- Add a CI workflow (lint, format check, type check, tests, build). None is committed yet.
- Pin dependency versions and commit the lockfile.
