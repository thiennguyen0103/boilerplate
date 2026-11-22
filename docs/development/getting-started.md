# Getting Started

## Prerequisites

Install:

- Node.js 22+
- pnpm 10 (`packageManager` in the root `package.json` is `pnpm@10.0.0`)
- Docker and Docker Compose
- Git

## Installation

Run this from the repository root only:

```bash
pnpm install
```

pnpm then creates `node_modules` inside each app as links into the root store. Do not delete those folders, and do not run `pnpm install` inside `apps/api`, `apps/web`, or `apps/admin`. A second install there creates another lockfile and a separate dependency tree. If the app links are missing, run `pnpm install` from the root again.

## Environment Setup

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
```

Never commit real secrets. Variable names are listed in `../infrastructure/environment-variables.md`.

The API example uses the same PostgreSQL user, password, and database name as `docker-compose.yml` (`app` / `app` / `app`). Local ports are API `3000`, customer app `3001`, and admin `3002`.

## Start Infrastructure

```bash
docker compose up -d postgres
pnpm db:run
```

`pnpm db:run` applies TypeORM migrations for `@acme/api`. The same scripts are `pnpm db:revert`, `pnpm db:show`, `pnpm db:generate`, and `pnpm db:create`.

## Development

```bash
pnpm dev
```

Refer to the root `package.json` for available scripts.

## Quality Checks

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:e2e
```

Only run scripts that are defined in the repository.

## Troubleshooting

If an application fails to start:

1. Check environment variables.
2. Check database connectivity.
3. Check package installation.
4. Check application logs.
5. Verify configured ports are available.
