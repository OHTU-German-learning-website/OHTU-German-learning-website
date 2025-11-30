# src Directory Overview

This directory contains the application source code organized by responsibility. Below is a quick guide to the main folders and notable files.

## Top-Level Structure

- `app/` – Next.js App Router pages, layouts, and API route handlers. Subfolders group feature areas (e.g. `auth/`, `grammar/`, `learning/`, `admin/`, `pages/` for HTML content pages, and `api/` for server endpoints). Global styles (`globals.css`) and the root `layout.js` live here.
- `backend/` – Server-side utilities and services (database access, configuration, logging, middleware wrappers, auth/session, HTML page services). Not imported client-side. Includes:
  - `db.js`, `config.js`, `logging.js`, `html-services.js`
  - `auth/` (password hashing + session management)
  - `middleware/` (`withAuth`, `withInputValidation` and their tests, middleware README)
  - `test/` backend-specific helpers/tests
- `components/` – Reusable UI components. Currently organized under `components/ui/`.
- `context/` – React context providers and related logic (e.g. user and glossary contexts). Contains its own README.
- `shared/` – Common code shared across client and server: constants, hooks, schemas (Zod), styles, small utilities.
- `styles/` – Global or feature-scoped standalone CSS not colocated with components (e.g. `anchoredExercises.css`).
- `middleware.js` – Global Next.js middleware controlling auth-based route access and redirects.

## Common Patterns

- API route composition uses `withAuth` and `withInputValidation` from `backend/middleware` to apply auth checks and Zod validation.
- Sessions are JWT-based (HS256) stored in an HTTP-only cookie (`AUTH_COOKIE_NAME`) via helpers in `backend/auth/session.js`.
- Database access goes through the pooled `DB` object in `backend/db.js` and transactional helper `DB.transaction`.
- Shared validation schemas are authored in `shared/schemas/` and consumed in API routes with `withInputValidation`.

## Adding New Code

- New server-only utilities: place in `backend/` (avoid importing them into client components).
- Reusable UI pieces: create a descriptive subfolder in `components/ui/`.
- Feature-specific page + API handlers: add under `app/<feature>/` keeping route semantics.
- Shared constants or cross-cutting helpers: add to `shared/` in the appropriate subfolder.

## Testing Notes

- Middleware and validation have dedicated tests under `backend/middleware/`.
- Backend helpers use test flags (`isTest`) allowing session and DB swapping.

## Conventions

- Prefer composing API handlers with wrappers instead of duplicating auth/validation logic.
- Keep environment variable access centralized to `backend/config.js` via `getConfig()`.
- Use Zod schemas from `shared/schemas` for input validation to ensure consistent error formatting.

---

For deeper details on middleware wrappers, see `backend/middleware/README.md`. For auth/session details, consult JSDoc in `backend/auth/session.js` and `backend/auth/hash.js`.
