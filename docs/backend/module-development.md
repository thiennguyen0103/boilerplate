# Module Development Guide

## 1. Purpose

This guide describes how to create a new backend module.

## 2. Before Creating a Module

Identify:

- The module's responsibility.
- Its domain concepts.
- Its use cases.
- Its persistence requirements.
- Its external dependencies.
- Its interactions with other modules.

The `users` module in this repo keeps repository interfaces in `domain/repositories` and HTTP files in `presentation/http`. Follow that layout.

## 3. Suggested Structure

```text
modules/
└── products/
    ├── domain/
    │   ├── entities/
    │   ├── value-objects/
    │   └── errors/
    │
    ├── application/
    │   ├── use-cases/
    │   ├── ports/
    │   └── dto/
    │
    ├── infrastructure/
    │   ├── persistence/
    │   └── adapters/
    │
    ├── presentation/
    │   ├── controllers/
    │   └── dto/
    │
    └── products.module.ts
```

## 4. Implementation Order

1. Define domain concepts and invariants.
2. Define application use cases.
3. Define required repository or service ports.
4. Implement infrastructure adapters.
5. Implement HTTP controllers and request DTOs.
6. Register providers and dependency injection.
7. Add unit and integration tests.
8. Add API documentation where applicable.

## 5. Review Checklist

- [ ] Module has a clear responsibility.
- [ ] Domain logic is independent of frameworks.
- [ ] Controllers contain no business logic.
- [ ] Repository implementations are inside Infrastructure.
- [ ] Dependencies point in the correct direction.
- [ ] Input validation is implemented.
- [ ] Errors are handled consistently.
- [ ] Tests cover important behavior.
