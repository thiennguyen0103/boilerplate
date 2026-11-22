# Routing Guidelines

The starter has one public Next.js page and an admin app with a single TanStack Router route. Add the structure below with the feature that needs it.

## Customer Application

The customer application uses Next.js App Router.

- Use route groups to organize related pages.
- Use layouts for shared page structures.
- Keep route-specific components close to their pages.
- Use loading and error boundaries where appropriate.
- Use URL parameters for shareable filters and navigation state.

## Admin Application

The admin application uses TanStack Router with code-based routes defined in `apps/admin/src/app/router/router.tsx`.

- Keep route configuration centralized.
- Group routes by feature.
- Separate route definitions from page components.
- Use protected layouts for authenticated UI.

## Authorization

Frontend route guards improve navigation and user experience.

They are not a substitute for backend authorization.
