# Entity Design Guidelines

## Principles

- Model entities around clear persistence responsibilities.
- Use stable primary keys.
- Define explicit relationships.
- Add constraints that protect data integrity.
- Avoid unnecessary duplication.

## Relationships

Choose relationship types deliberately:

- One-to-one.
- One-to-many.
- Many-to-one.
- Many-to-many.

Consider whether a join table needs its own entity.

## Naming

Use consistent table and column naming conventions.

The exact naming strategy should match the project's TypeORM configuration.

## Domain Separation

TypeORM entities are persistence models.

Do not automatically treat them as domain entities or API response objects.

## Sensitive Data

Identify sensitive fields and define appropriate access, retention, and logging rules.
