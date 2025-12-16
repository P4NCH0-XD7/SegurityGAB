# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repo overview
This is a Node/TypeScript monorepo with two main apps:
- `backend/`: NestJS API (TypeORM + MySQL, JWT auth)
- `frontend/`: Next.js App Router UI

There is also a repo-level test harness:
- Root `jest.config.js` and root `playwright.config.ts` run cross-app test suites under `backend/tests/*` and `frontend/tests/*`.

## Common commands

### Install deps
This repo is not using npm workspaces; install per package.

```sh
npm install
npm --prefix backend install
npm --prefix frontend install
```

### Run locally (dev)
Backend (defaults to port `3001`):
```sh
npm --prefix backend run start:dev
```

Frontend (defaults to port `3000`):
```sh
npm --prefix frontend run dev
```

When running FE against a local BE, set the API base URL for the browser:
```sh
$env:NEXT_PUBLIC_API_URL = 'http://127.0.0.1:3001'
npm --prefix frontend run dev
```

### Build
```sh
npm --prefix backend run build
npm --prefix frontend run build
```

### Lint (backend)
```sh
npm --prefix backend run lint
```

### Tests

#### Backend tests (repo-level Jest suites)
The root `jest.config.js` is wired to `backend/tests/**`.

Run unit / functional suites:
```sh
npm run test:unit
npm run test:functional
```

Run a single Jest test file:
```sh
npx jest --runTestsByPath backend/tests/unit/auth.spec.ts
```

Run by test name:
```sh
npx jest backend/tests/unit --testNamePattern "login"
```

#### Backend tests (co-located `backend/src/**/*.spec.ts`)
The `backend/package.json` has its own Jest config (rooted at `backend/src`).

```sh
npm --prefix backend run test
```

Run a single test file:
```sh
npm --prefix backend run test -- --runTestsByPath src/modules/users/users.service.spec.ts
```

#### Frontend unit tests (Jest)
```sh
npm --prefix frontend run test
```

Run a single test file:
```sh
npm --prefix frontend run test -- --runTestsByPath app/components/ProductCard.spec.tsx
```

#### End-to-end / browser tests (Playwright)

Repo-level Playwright:
- Config: `playwright.config.ts`
- Starts BOTH servers via `scripts/e2e-webserver.mjs`.

Run backend E2E suite:
```sh
npm run test:e2e
```

Run blackbox tests (backend + frontend):
```sh
npm run test:blackbox
```

Run a single Playwright spec:
```sh
npx playwright test backend/tests/e2e/auth/auth.e2e.spec.ts
```

Frontend-only Playwright (separate config):
- Config: `frontend/playwright.config.ts`
- Runs Next build+start on port `3005` and points `NEXT_PUBLIC_API_URL` to the hosted backend.

```sh
npm --prefix frontend run test:e2e
npm --prefix frontend run test:e2e -- e2e/login.e2e.spec.ts
```

#### Load tests (Artillery)
```sh
npm run test:load
```

## High-level architecture

### Backend (NestJS)
Entry points and cross-cutting behavior:
- `backend/src/main.ts`
  - Uses `helmet()`.
  - Registers global exception formatting via `backend/src/common/filters/all-exceptions.filter.ts`.
  - Serves static uploads from `<repo>/uploads` at the `/uploads/` URL prefix.
  - Enables CORS for `http://localhost:3000` and `https://segurity-*.vercel.app`.
  - Listens on `process.env.PORT` (default `3001`).

App wiring:
- `backend/src/app.module.ts`
  - Applies rate limiting globally via `@nestjs/throttler` (`ThrottlerGuard`).
  - DB + domain modules are conditionally enabled (controlled by `DB_DISABLED === 'true'`).
  - Database config comes from `backend/config/typeorm.config.ts` (MySQL + env vars).

Domain modules (feature-oriented):
- `backend/src/modules/auth`
  - Routes under `/auth/*` (e.g. `POST /auth/login`, `POST /auth/register`).
  - JWT setup uses `JWT_SECRET` from `@nestjs/config`.
  - Auth guards / role utilities live in `backend/src/modules/auth/strategies/*` and `backend/src/modules/auth/decoradores/*`.
- `backend/src/modules/users`
  - User entity in `backend/src/modules/users/user_entity/user.entity.ts`.
  - Users service is exported for use by Auth.
  - Admin endpoints are isolated under `backend/src/modules/users/admin/*`.
- `backend/src/modules/products`
  - CRUD under `/products/*`.
  - File uploads via `POST /products/upload` write to `./uploads` and return a `/uploads/<file>` path.
- `backend/src/modules/orders`
  - CRUD under `/orders/*`.

### Frontend (Next.js App Router)
Routing + layout:
- `frontend/app/layout.tsx` is the root layout.
  - Wraps the app in `AuthProvider` and `CartProvider` (`frontend/app/context/*`).
  - Renders shared UI: `Nadvar` + `Footer`.
- Route folders in `frontend/app/*` (e.g. `login/`, `register/`, `productos/`, `carrito/`, `checkout/`, `dashboard/`).

API integration:
- `frontend/app/services/api.ts` centralizes API calls and uses `NEXT_PUBLIC_API_URL`.
- `frontend/next.config.ts` sets security headers (CSP, frame options, etc.) using `BACKEND_URL` to allow images/connect to the backend.

### Cross-app E2E orchestration
- `scripts/e2e-webserver.mjs` is used by the root Playwright config to spin up servers.
  - Starts Nest via `npm --prefix backend run start:dev` (unless `E2E_START_BACKEND=false`).
  - Starts Next via `npm --prefix frontend run dev -- -p <port>`.
  - Sets `NEXT_PUBLIC_API_URL` for the frontend to the configured backend URL.

## Environment variables used in code
Backend:
- `PORT` (default `3001`)
- `DB_DISABLED` (when `'true'`, `AppModule` does not load TypeORM + domain modules)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` (TypeORM MySQL)
- `JWT_SECRET` (JWT signing)

Frontend:
- `NEXT_PUBLIC_API_URL` (browser-facing API base URL)
- `BACKEND_URL` (used for CSP/security headers in `next.config.ts`)

Playwright (root config / webserver):
- `E2E_BACKEND_URL` (default `http://127.0.0.1:3001`)
- `E2E_FRONTEND_URL` (default `http://127.0.0.1:3000`)
- `E2E_START_BACKEND` (`false` to skip starting local backend and test against a remote backend)
