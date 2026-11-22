# Database Seeding

## Purpose

Seeding provides predictable initial or test data.

## Guidelines

- Keep seed scripts repeatable where practical.
- Avoid inserting duplicate records.
- Separate development seed data from production initialization.
- Never commit real customer data or production secrets.
- Make destructive seed operations explicit.

## Seed Categories

- Reference data.
- Development fixtures.
- Test fixtures.
- Optional demo data.

## Testing

Tests should use isolated, controlled data and should not depend on manual database setup.
