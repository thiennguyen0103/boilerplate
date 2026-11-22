# Database Migrations

## Principles

- Every database schema change must be represented by a migration.
- Migrations must be committed to version control.
- Production deployments must apply migrations in a controlled manner.
- Do not use TypeORM `synchronize: true` in production.

## Migration Guidelines

- Use descriptive migration names.
- Keep migrations focused.
- Review generated SQL.
- Consider existing data before adding constraints.
- Consider backward compatibility during deployments.
- Provide rollback logic where practical.

## Commands

From the repository root, with `apps/api/.env` in place:

```bash
pnpm db:run
pnpm db:revert
pnpm db:show
pnpm db:generate
pnpm db:create
```

`pnpm db:generate` writes a migration into `apps/api/src/database/typeorm/migrations`. Review the SQL before applying it.

## Workflow

1. Update the relevant entity or schema definition.
2. Generate or create a migration.
3. Review the migration.
4. Test it against a local database.
5. Commit the migration.
6. Apply it through the deployment process.

## Production Safety

- Back up critical data where appropriate.
- Avoid destructive changes without a migration plan.
- Consider multi-step migrations for breaking changes.
