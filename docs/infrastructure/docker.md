# Docker Guidelines

## Purpose

Docker provides consistent local and deployment environments.

## Principles

- Keep images reproducible.
- Prefer multi-stage builds for application images.
- Avoid running production containers as root where practical.
- Do not bake secrets into images.
- Use explicit service health checks where appropriate.
- Persist database data through volumes.

## Local Development

`docker-compose.yml` runs PostgreSQL only. The database name, user, and password are `app`. `apps/api/.env.example` uses those same values.

Application images:

- API: `infrastructure/docker/api/Dockerfile`. The process command is `node dist/main.js`.
- Web: `infrastructure/docker/web/Dockerfile`.

`apps/api/Dockerfile` is not used.

## Production

- Use production-specific images.
- Keep runtime images minimal.
- Configure health checks.
- Configure resource limits where supported.
- Handle graceful shutdown.
- Keep application configuration outside the image.

## Database

Do not treat container-local database storage as a production backup strategy.

Define a separate backup and recovery process.
