# Customer Frontend Architecture

## 1. Overview

The customer application uses Next.js with the App Router.

The starter currently has `app/(public)/page.tsx`, `app/layout.tsx`, `app/globals.css`, `lib/api-client.ts`, and `lib/auth-client.ts`. The tree below is the structure for new features. TanStack Query and Zustand are not installed.

## 2. Responsibilities

The frontend is responsible for:

- Rendering pages and layouts.
- Handling user interactions.
- Client-side form validation.
- Managing UI state.
- Calling backend APIs.
- Displaying loading, empty, success, and error states.

The backend remains the source of truth for business rules and data integrity.

## 3. Recommended Structure

```text
apps/web/src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (protected)/
│   ├── layout.tsx
│   └── globals.css
│
├── features/
│   └── feature-name/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── types/
│       └── utils/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── lib/
│   ├── api/
│   ├── auth/
│   └── utils/
│
├── hooks/
├── providers/
└── types/
```

## 4. Server and Client Components

Prefer Server Components by default.

Use Client Components when browser APIs, local state, effects, or interactive event handlers are required.

Guidelines:

- Keep client boundaries as small as possible.
- Do not add `use client` to entire pages without a reason.
- Avoid passing non-serializable values across Server/Client Component boundaries.
- Keep secrets and server-only logic out of client bundles.

## 5. Data Fetching

- Use server-side fetching when it improves initial rendering and is appropriate for the page.
- Use TanStack Query for client-side server-state management where appropriate.
- Centralize API client configuration.
- Handle API errors consistently.
- Avoid duplicating the same server state in multiple state-management systems.

## 6. State Management

Use the simplest state-management solution that fits the requirement.

- React state: component-local state.
- URL search parameters: shareable navigation state and filters.
- TanStack Query: remote server state.
- Zustand: shared client-side state when necessary.

Do not introduce global state for values that can remain local.

## 7. Components

- Prefer small, composable components.
- Separate reusable UI components from feature-specific components.
- Keep business rules out of generic UI components.
- Use consistent component naming.
- Avoid unnecessary abstraction.

## 8. Forms

- Validate user input at the frontend for usability.
- Validate again at the backend for security and data integrity.
- Keep form schemas close to the feature that owns them.
- Provide accessible labels and validation messages.

## 9. UI States

Every data-driven page should consider:

- Loading.
- Empty.
- Success.
- Error.
- Unauthorized.
- Not found.

## 10. Authentication

Use `src/lib/auth-client.ts` for authentication requests. Keep the access token in memory, never in `localStorage`. The refresh token lives in an `HttpOnly` cookie set by the API.

Do not treat frontend route protection as the only authorization mechanism.

The backend must independently verify authentication and permissions.
