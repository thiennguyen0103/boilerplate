# Component Guidelines

## Component Categories

### UI Components

Reusable, presentation-focused components such as buttons, inputs, dialogs, and badges.

### Shared Components

Application-level reusable components such as headers, navigation, and page containers.

### Feature Components

Components that belong to a specific business feature.

## Guidelines

- Keep generic UI components independent of business rules.
- Prefer composition and explicit props.
- Avoid components with too many responsibilities.
- Keep feature-specific components inside their feature.
- Provide predictable loading, disabled, and error states.
- Follow accessibility standards.

## Component API

Component APIs should be:

- Explicit.
- Consistent.
- Typed.
- Easy to compose.
- Backward-compatible when practical.

## Documentation

Document complex components and non-obvious behavior.

Avoid documenting trivial implementation details.
