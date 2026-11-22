# NestJS Conventions

## Naming

- Modules: `UsersModule`
- Controllers: `UsersController`
- Providers: `UsersService`
- Use cases: `CreateUserUseCase`
- Request DTOs: `CreateUserRequest`
- Repository ports: an abstract class such as `UserRepository`, used directly as the injection token

## Module Organization

Each business module should own its controllers, application use cases, domain logic, and infrastructure implementations.

## Controllers

- Keep controllers thin.
- Validate incoming request data.
- Delegate operations to application use cases.
- Map application results to HTTP responses.
- Avoid direct database queries in controllers.

## Providers

- Use constructor injection.
- Prefer explicit interfaces and tokens at architectural boundaries.
- Avoid unnecessary global providers.

## Configuration

- Use centralized configuration.
- Validate required environment variables at startup.
- Never hardcode secrets.

## Code Quality

- Prefer explicit types.
- Avoid `any`.
- Keep functions focused.
- Handle errors explicitly.
- Do not suppress lint errors without a valid reason.
