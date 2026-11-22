# Database Architecture

## 1. Database

The application uses PostgreSQL as its relational database.

TypeORM is used for application persistence.

## 2. Connection

`DatabaseModule` owns the NestJS TypeORM connection. `AppModule` imports it and does not configure TypeORM itself.

The Nest connection is built from `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, and `DATABASE_PASSWORD`, with `synchronize: false`. Feature modules register entities with `TypeOrmModule.forFeature`. The TypeORM CLI data source is `apps/api/src/database/typeorm/data-source.ts`. It loads the API environment files, discovers `*.orm-entity.ts` files, and applies migrations from `apps/api/src/database/typeorm/migrations`. Authentication tables (`refresh_sessions`, `refresh_token_history`, `oauth_accounts`) are TypeORM entities in the `auth` module and use the same connection.

## 3. Responsibilities

The database is responsible for:

- Persistent application data.
- Referential integrity.
- Unique constraints.
- Data consistency.
- Transactional operations.
- Indexes and query performance.

## 4. Ownership

- The backend owns database access.
- Frontend applications must not connect directly to PostgreSQL.
- Business modules should own their persistence logic.
- Database entities must not be shared as frontend contracts.

## 5. Data Integrity

Use appropriate:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Not-null constraints.
- Check constraints.
- Indexes.

Important business invariants must not depend exclusively on frontend validation.

## 6. Migrations

All schema changes must be version-controlled.

Never use automatic schema synchronization in production.

## 7. Transactions

Use transactions when multiple database operations must succeed or fail together.

Keep transaction boundaries explicit and avoid unnecessarily long-running transactions.

## 8. Performance

- Avoid N+1 queries.
- Add indexes based on actual query patterns.
- Paginate large result sets.
- Select only necessary columns.
- Inspect expensive queries.
