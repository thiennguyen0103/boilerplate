# Coding Conventions

## General

- Use TypeScript for application code where applicable.
- Prefer explicit types.
- Avoid `any`.
- Keep functions and modules focused.
- Use descriptive names.
- Avoid unnecessary abstractions.
- Handle errors explicitly.

## Naming

- Components and classes: PascalCase.
- Variables and functions: camelCase.
- Constants: descriptive names.
- Files: follow the conventions of the owning application and framework.

## Code Organization

- Keep code close to the feature that owns it.
- Separate presentation, application, domain, and infrastructure responsibilities.
- Avoid circular dependencies.
- Keep shared utilities genuinely reusable.

## Comments

Comments should explain intent, constraints, or non-obvious decisions.

Do not use comments as a substitute for clear code.

## Type Safety

- Avoid unsafe type assertions.
- Prefer discriminated unions for complex variants.
- Validate untrusted input at boundaries.
- Avoid leaking `unknown` or `any` through public interfaces.

## Code Review

Review for correctness, readability, security, tests, and consistency with architecture.
