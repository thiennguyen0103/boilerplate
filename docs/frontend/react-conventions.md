# React Conventions

## Components

- Use function components.
- Prefer composition over complex prop combinations.
- Keep components focused on one responsibility.
- Extract reusable logic into hooks when appropriate.
- Avoid unnecessary component abstractions.

## Naming

- Components: PascalCase.
- Hooks: `use` prefix.
- Utilities: camelCase.
- Constants: descriptive uppercase names where appropriate.

## Props

- Define explicit TypeScript prop types.
- Avoid overly generic component APIs.
- Prefer discriminated unions for mutually exclusive component states.

## Effects

- Use effects for synchronization with external systems.
- Do not use effects for values that can be calculated during rendering.
- Clean up subscriptions and event listeners.

## Accessibility

- Prefer semantic HTML.
- Support keyboard navigation.
- Provide accessible names for interactive elements.
- Ensure form fields have labels.
- Do not rely on color alone to communicate state.

## Performance

- Avoid premature memoization.
- Use memoization when it addresses a measured or clear performance issue.
- Keep client-side bundles as small as practical.
