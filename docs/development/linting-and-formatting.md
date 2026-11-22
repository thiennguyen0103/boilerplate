# Linting and Formatting

## Linting

The repository uses oxlint for linting. The root `lint` script skips `node_modules`, `dist`, and `.next`. Each app config also skips that app's `node_modules`. oxfmt uses the same skips.

Use the scripts defined in the root and application package configurations.

## Guidelines

- Resolve lint errors before merging.
- Avoid disabling rules globally.
- Add exceptions only when justified.
- Keep configuration consistent across packages where practical.

## Formatting

Use the formatting tool configured by the repository.

Do not introduce a second formatter without an explicit decision.

## Type Checking

Run TypeScript type checks for the affected applications and packages.

## CI

Linting and type checking should run automatically in CI.
