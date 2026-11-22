# Backend Architecture

## 1. Overview

The backend is built with NestJS using a Modular Monolith architecture and Clean Architecture principles.

Each business module should have clear responsibilities and explicit boundaries.

## 2. Architectural Layers

Each module may contain the following layers:

```text
module-name/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

### Domain

Contains business concepts and rules that are independent of NestJS, TypeORM, HTTP, and external services.

Responsibilities:

- Entities and value objects.
- Domain rules and invariants.
- Domain exceptions.
- Repository interfaces when required by the domain.

The domain layer must not depend on infrastructure or presentation layers.

### Application

Coordinates application use cases.

Responsibilities:

- Use cases.
- Application services.
- Input and output DTOs where appropriate.
- Repository ports.
- External service ports.
- Transaction coordination.

Application logic should depend on abstractions rather than concrete infrastructure implementations.

### Infrastructure

Contains technical implementations.

Responsibilities:

- TypeORM entities.
- Repository implementations.
- Database access.
- External API clients.
- Message queue adapters.
- File storage adapters.

Infrastructure implements interfaces defined by inner layers.

### Presentation

Contains HTTP-related implementation.

Responsibilities:

- Controllers.
- Request DTOs.
- Response mapping.
- Guards.
- Interceptors.
- HTTP-specific validation and decorators.

Controllers should remain thin and delegate business operations to application use cases.

## 3. Dependency Direction

Dependencies must point inward:

```text
Presentation → Application → Domain
Infrastructure → Application / Domain
```

The domain layer must not import NestJS, TypeORM, HTTP libraries, or other infrastructure frameworks.

## 4. Module Structure

Example:

```text
src/
├── modules/
│   ├── users/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── errors/
│   │   │   └── repositories/
│   │   ├── application/
│   │   │   └── use-cases/
│   │   ├── infrastructure/
│   │   │   └── persistence/
│   │   ├── presentation/
│   │   │   └── http/
│   │   └── users.module.ts
│   ├── auth/
│   └── health/
├── config/
├── database/
├── app.module.ts
└── main.ts
```

## 5. Module Boundaries

- A module owns its domain logic and persistence.
- Other modules must not directly access its repositories.
- Cross-module communication should use exported application services or explicit contracts.
- Avoid circular dependencies.
- Do not create a shared module for unrelated business functionality.

## 6. Dependency Injection

Use NestJS dependency injection at application and infrastructure boundaries.

Bind ports with an explicit Nest provider. Ports are TypeScript interfaces in `application/ports`, so each module defines `Symbol` injection tokens in `<module>.tokens.ts`:

```ts
{ provide: USERS_TOKENS.USER_REPOSITORY, useExisting: UserRepository }
```

Use cases are plain classes without Nest decorators. Build them with `useFactory` and list the tokens in `inject`.

Use-case classes should receive dependencies through constructor injection.

## 7. Business Logic

- Keep business rules inside domain entities or application use cases.
- Avoid putting business logic in controllers.
- Avoid putting business logic in TypeORM entities.
- Do not use repositories as general-purpose service containers.
- Keep use cases focused on one application operation.

## 8. Error Handling

Use domain errors for business rule violations and application errors for application-level failures.

Translate internal errors into appropriate HTTP responses at the presentation boundary.

Never expose stack traces, SQL statements, or sensitive internal information in production responses.

## 9. Testing

- Unit-test domain rules and use cases.
- Integration-test repositories and infrastructure adapters.
- E2E-test HTTP endpoints and complete application workflows.

See `../testing/testing-strategy.md`.
