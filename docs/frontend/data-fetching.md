# Data Fetching

`apps/web/src/lib/api-client.ts` is the starter HTTP client. TanStack Query is not installed. Add it when a feature needs client-side server state.

## Principles

- Centralize API client configuration.
- Keep API calls close to their owning feature.
- Define request and response types.
- Handle errors consistently.
- Avoid duplicated requests and duplicated server state.

## Next.js

Use Server Components and server-side fetching when appropriate.

Use client-side fetching for interactive experiences that require it.

Do not expose server-only secrets to browser code.

## TanStack Query

Use TanStack Query for client-side server-state management.

Guidelines:

- Use consistent query keys.
- Keep query functions reusable.
- Configure sensible stale and retry behavior.
- Invalidate affected queries after mutations.
- Handle loading and error states explicitly.

## API Client

The API client should centralize:

- Base URL configuration.
- Request headers.
- Credentials policy.
- Response parsing.
- Error mapping.
- Request cancellation where appropriate.

## Security

Do not trust client-side data or client-side authorization checks.
