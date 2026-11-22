# System Architecture Overview

## 1. Purpose

This document describes the high-level architecture of the application.

The project uses a monorepo to manage multiple applications and shared packages.

## 2. Technology Stack

| Layer             | Technology                            |
| ----------------- | ------------------------------------- |
| Customer frontend | Next.js                               |
| Admin frontend    | React + Vite                          |
| Backend           | NestJS                                |
| Architecture      | Clean Architecture + Modular Monolith |
| Authentication    | Custom `auth` module (JWT + refresh)  |
| ORM               | TypeORM                               |
| Database          | PostgreSQL                            |
| Package manager   | pnpm workspaces                       |
| Linting           | oxlint                                |
| Testing           | Jest unit tests and a health e2e test |
| Containerization  | Docker                                |

## 3. Application Architecture

The system consists of three main applications.

### Customer Application

- Built with Next.js.
- The starter ships one public page, plus `src/lib/api-client.ts` and `src/lib/auth-client.ts`.
- Feature folders, TanStack Query, and Zustand are the convention for new features. They are not installed yet.
- Communicates with the backend through HTTP APIs.

### Admin Application

- Built with React and Vite.
- The starter ships one dashboard route using TanStack Router.
- Protected layouts and API access are the convention for new admin features. They are not installed yet.

### Backend Application

- Built with NestJS.
- Exposes REST APIs.
- Uses a modular monolith architecture.
- Applies Clean Architecture within business modules.
- Handles authentication, authorization, business logic, and persistence.

## 4. High-Level Communication

Customer frontend and admin frontend communicate with the backend through HTTP APIs.

The backend communicates with PostgreSQL through TypeORM.

Authentication is handled by the API's `auth` module: short-lived JWT access tokens, rotating refresh tokens in an `HttpOnly` cookie, and Google sign-in. See `../authentication/authentication-setup.md`. Application-specific authorization is enforced by the backend.

## 5. Architectural Principles

- Separation of concerns.
- Dependency inversion.
- Explicit module boundaries.
- Business logic independent of framework details.
- Validation at system boundaries.
- Centralized error handling.
- Consistent API contracts.
- Testable business logic.
- Secure-by-default configuration.

## 6. Monorepo Structure

```text
apps/
├── api/
├── web/
└── admin/

packages/
└── shared-types/

docs/
```

## 7. Architecture Boundaries

- The backend owns business rules and data integrity.
- The frontend owns presentation and user interaction.
- The admin application is a separate client, not a trusted security boundary.
- Shared packages contain reusable contracts and utilities, not duplicated business logic.
- Database access must remain inside backend infrastructure code.
