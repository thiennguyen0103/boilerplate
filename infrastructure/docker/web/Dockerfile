FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile && pnpm --filter @acme/web build
CMD ["pnpm", "--filter", "@acme/web", "start"]
