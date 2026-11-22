# API Design Guidelines

## 1. General Principles

- Use REST conventions for HTTP APIs.
- Use nouns for resource paths.
- Use HTTP methods according to their semantics.
- Keep request and response structures consistent.
- Version APIs when a breaking contract change requires it.

## 2. Resource Naming

Prefer plural resource names.

Examples:

```text
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

## 3. HTTP Methods

| Method | Purpose                                               |
| ------ | ----------------------------------------------------- |
| GET    | Retrieve resources                                    |
| POST   | Create resources or execute non-idempotent operations |
| PUT    | Replace a resource                                    |
| PATCH  | Partially update a resource                           |
| DELETE | Delete a resource                                     |

## 4. Response Design

Use consistent response structures.

Example:

```json
{
  "data": {
    "id": "resource-id"
  }
}
```

For paginated responses:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0
  }
}
```

## 5. HTTP Status Codes

- 200: Successful request.
- 201: Resource created.
- 204: Successful request without a response body.
- 400: Invalid request.
- 401: Unauthenticated.
- 403: Unauthorized.
- 404: Resource not found.
- 409: Conflict.
- 422: Semantically invalid input, when used by the API convention.
- 429: Too many requests.
- 500: Unexpected server error.

## 6. API Documentation

- Document public endpoints.
- Describe request and response schemas.
- Document authentication requirements.
- Document relevant error responses.
- Keep OpenAPI documentation synchronized with implementation.

## 7. Starter endpoints

These routes exist today. New resources should use the `{ "data" }` envelope above. The starter routes return their body directly.

| Method | Path                | Auth          | Success                                                  |
| ------ | ------------------- | ------------- | -------------------------------------------------------- |
| GET    | `/api/v1/health`    | Public        | `{ "status": "ok", "timestamp": "<iso>" }`               |
| POST   | `/api/v1/users`     | Public sample | `201` and the user object. `409` when the email exists.  |
| GET    | `/api/v1/users/:id` | Public sample | `200` and the user object. `404` when the id is missing. |

Sign-up goes through `POST /api/v1/auth/register`. `POST /api/v1/users` is an administrative route and returns `403` until permissions exist. Authentication routes live under `/api/v1/auth/*`. See `../authentication/authentication-setup.md`.

## 8. Security

- Validate all input.
- Enforce authorization on the backend.
- Avoid exposing internal database structures.
- Avoid returning sensitive fields.
- Apply pagination and request limits where appropriate.
