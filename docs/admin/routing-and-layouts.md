# Admin Routing and Layouts

The admin app uses TanStack Router with code-based routing. Routes are defined in `src/app/router/router.tsx`. The root route renders `AdminLayout` from `src/app/layouts/` and a shared not-found page. Page components live in their feature folder, for example `src/features/dashboard/pages/`.

There is no authenticated layout yet. Add one when the first protected admin page is built, for example as a pathless layout route with a `beforeLoad` guard.

## Principles

- Separate authenticated and unauthenticated route areas.
- Use shared layouts for common navigation and page structures.
- Keep feature routes organized.
- Handle loading, errors, and not-found states.
- Keep route definitions predictable.

## Layouts

Common layouts may include:

- Authentication layout.
- Main admin layout.
- Feature-specific layout.

## Route Protection

Use frontend route protection to improve navigation.

All protected operations must still be authorized by the backend.
