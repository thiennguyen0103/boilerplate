# State Management

The starter pages keep their content in the component. TanStack Query and Zustand are not installed.

## State Categories

| State type            | Recommended approach                   |
| --------------------- | -------------------------------------- |
| Component-local state | React `useState`                       |
| Derived state         | Calculate during rendering             |
| URL state             | Search parameters and route parameters |
| Server state          | TanStack Query                         |
| Shared client state   | Zustand when necessary                 |
| Form state            | Form library or local React state      |

## Guidelines

- Choose the simplest solution that satisfies the requirement.
- Do not duplicate server state unnecessarily.
- Avoid putting all application state in a global store.
- Keep state close to the components that use it.
- Use URL state for filters and navigation state that should be shareable.

## Zustand

Use Zustand for shared client-side state when component state and URL state are insufficient.

Avoid using Zustand as a replacement for server-state management.
