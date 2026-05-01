# Architecture Overview

`portfolio-pbn` is a production-style monorepo with two independent applications sharing the same business domain.

## High-Level Structure

- `web/`: Next.js 16 public site + web CMS
- `app/`: Flutter admin app for tablet/mobile workflows
- `docs/`: supplemental technical notes

## System Boundaries

- The web app owns backend responsibilities (API routes, auth, database access, media uploads).
- The Flutter app is a client that consumes `/api/admin/*` endpoints.
- There is no shared runtime package between `web/` and `app/`.

## Request Flow

1. Public users interact with the Next.js site.
2. Admin users manage content via:
   - web CMS (`web` admin routes), or
   - Flutter app (`app`) calling the same backend API.
3. The backend persists and reads data from PostgreSQL (Neon) through Prisma.
4. Media uploads are processed server-side through Cloudinary endpoints.

## Web Architecture (`web/`)

- App Router with route groups:
  - `(public)` for SEO-facing pages
  - `(admin)` for protected CMS routes
  - `api/admin/*` for Flutter/admin REST endpoints
- Server Actions for mutations with admin guards.
- Prisma + PostgreSQL (Neon) as the source of truth.
- NextAuth for web session auth.
- Custom JWT flow for Flutter API auth.

## App Architecture (`app/`)

- Feature-based structure under `lib/features/`.
- Core infrastructure under `lib/core/` (auth, API client, routing, theme, notifications).
- Shared reusable widgets/models under `lib/shared/`.
- Riverpod for state management.
- Offline-first support using local persistence and sync queues.

## Security Model

- Secrets are never committed (`.env*`, service account files, keys).
- API admin endpoints require JWT validation.
- Web admin mutations require admin guards.
- Media credentials remain server-side only.

## Deployment Model

- `main` branch: production.
- `develop` branch: preview/staging.
- Vercel hosts web/API deployments.
- Flutter app distributed separately for admin operations.
