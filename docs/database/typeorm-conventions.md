# TypeORM Conventions

## Entity Design

- Keep entities focused on persistence representation.
- Use explicit column types where appropriate.
- Define relationships carefully.
- Avoid unnecessary eager loading.
- Use database constraints for data integrity.

## Repositories

- Keep TypeORM repository usage inside Infrastructure.
- Expose application-specific repository interfaces.
- Return domain or application models rather than leaking ORM details across layers.

## Queries

- Avoid loading unnecessary relations.
- Prefer explicit query conditions.
- Use pagination for large datasets.
- Review query performance for complex operations.

## Transactions

Use TypeORM transaction facilities for operations that require atomicity.

## Schema Changes

Use migrations for schema changes.

Do not rely on production schema synchronization.

## Testing

Integration-test repository implementations against PostgreSQL where database behavior matters.
