# Clean Architecture Guidelines

## 1. Purpose

Clean Architecture separates business logic from frameworks, databases, and delivery mechanisms.

The goal is to make application logic easier to test, maintain, and change.

## 2. Layers

| Layer          | Responsibility                        |
| -------------- | ------------------------------------- |
| Domain         | Business rules and domain concepts    |
| Application    | Use cases and orchestration           |
| Infrastructure | Database and external integrations    |
| Presentation   | HTTP controllers and request handling |

## 3. Dependency Rules

- Domain must not depend on other application layers.
- Application may depend on Domain.
- Infrastructure implements interfaces required by inner layers.
- Presentation delegates to Application.
- Framework-specific classes must not leak into Domain.

## 4. Use Cases

A use case represents an application operation.

Example:

```ts
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    // Application-specific orchestration.
  }
}
```

Use cases should:

- Have one clear responsibility.
- Accept explicit input.
- Return explicit output.
- Depend on abstractions.
- Avoid HTTP-specific concerns.

## 5. Repositories

Repository interfaces belong in the inner layer that needs them.

Implementations belong in Infrastructure.

Avoid exposing TypeORM repositories outside Infrastructure.

## 6. DTOs and Domain Objects

Request DTOs belong to Presentation.

Application input models belong to Application.

Domain entities should represent business concepts, not HTTP payloads or database table structures.

## 7. When to Apply

Apply Clean Architecture consistently to business modules.

Do not create unnecessary layers for simple technical modules that have no meaningful domain logic.
