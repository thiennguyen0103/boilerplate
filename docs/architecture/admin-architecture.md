# Admin Frontend Architecture

## 1. Overview

The admin application uses React and Vite.

The starter uses TanStack Router with one dashboard route inside a shared admin layout. There is no API client yet. The tree below is the structure for new admin features. TanStack Query is not installed.

## 2. Responsibilities

- Internal management interfaces.
- Administrative workflows.
- Data tables and filtering.
- Forms and CRUD operations.
- User and permission management interfaces.

All security-sensitive operations must be authorized by the backend.

## 3. Recommended Structure

```text
apps/admin/src/
├── app/
│   ├── router/
│   ├── providers/
│   └── layouts/
│
├── features/
│   └── feature-name/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── schemas/
│       └── types/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── lib/
├── hooks/
├── stores/
└── main.tsx
```

## 4. Routing

- Use TanStack Router with code-based routes in `src/app/router/router.tsx`.
- Use a centralized route configuration.
- Register new routes in the route tree so links and params stay type-safe.
- Group routes by application feature.
- Keep route definitions separate from page implementation.
- Use route-level loading and error handling where supported.
- Protect private UI routes for usability, but enforce authorization on the backend.

## 5. Data Fetching

- Use a centralized API client.
- Use TanStack Query for server-state management when applicable.
- Keep query keys consistent.
- Invalidate relevant queries after mutations.
- Handle API errors consistently.

## 6. Components

- Reuse shared UI components.
- Keep feature-specific components inside their owning feature.
- Avoid mixing data-fetching concerns with generic presentation components.

## 7. Access Control

The admin frontend may hide or disable UI actions based on the current user's permissions.

However, frontend permission checks are not security controls.

Every protected backend endpoint must verify the user's authorization independently.
