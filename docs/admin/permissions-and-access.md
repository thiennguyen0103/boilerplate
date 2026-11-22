# Admin Permissions and Access

## General Principles

- The backend is the authority for access control.
- The frontend may hide or disable unavailable actions.
- Never rely on hidden UI elements as a security mechanism.
- Check permissions on every protected backend operation.
- Follow least-privilege principles.

## Frontend Behavior

The frontend may use permission information to:

- Render navigation items.
- Show or hide actions.
- Disable unavailable controls.
- Display access-denied pages.

## Backend Enforcement

The backend must independently verify:

- Authentication.
- Required permissions.
- Resource ownership or scope.
- Relevant business constraints.

## Project-Specific Configuration

Actual roles, permissions, and access policies must be defined in:

`../project/user-roles-and-permissions.md`.
