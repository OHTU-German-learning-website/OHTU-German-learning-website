# Global Middleware Documentation

_Last Updated: November 30, 2025_

**File Location**: `src/middleware.js`

This document explains the purpose and functionality of the global Next.js middleware that runs on every request (except API routes and static assets).

## Table of Contents

1. [Purpose](#purpose)
2. [How It Works](#how-it-works)
3. [Configuration](#configuration)
4. [Examples](#examples)
5. [API Route Helpers](#api-route-helpers)
6. [Notes](#notes)

## Purpose

The middleware is used for:

- Protecting routes that require authentication.
- Redirecting logged-in users away from routes meant for unauthenticated users.

## How It Works

1. The middleware checks the session cookie (`AUTH_COOKIE_NAME`) to determine if the user is logged in.
2. It uses two route lists:

   - `authRequired`: Routes that only logged-in users can access.
   - `unauthRequired`: Routes that only logged-out users can access.

3. The middleware performs the following checks:

   - If the user is **not logged in** and tries to access a route in `authRequired`, they are redirected to the login page (`/auth/login`) with the original path saved as a `redirect` query parameter. After successful login, they will be redirected back to the originally requested page.
   - If the user is **logged in** and tries to access a route in `unauthRequired`, they are redirected to the home page (`/`).
   - If the route is not in either list, the request is allowed to proceed.

4. The middleware ensures that responses are not cached.

## Configuration

The middleware is configured to run on all routes, except API routes and static common assets.

To modify the behavior, edit `src/middleware.js`.

- To add paths only logged-in users can access, append them to `const authRequired = [];`
- To add restricted paths logged-in users cannot access, append them to `const unauthRequired = [];`

Paths are enclosed in quotes and separated by commas.

## Examples

To protect a route so that only logged-in users can access it, add the route to `authRequired`:

```javascript
const authRequired = ["/grammar/exercises", "/edit_info", "/dashboard"];
```

To restrict a route so that logged-in users cannot access it, add the route to `unauthRequired`:

```javascript
const unauthRequired = ["/auth/login", "/auth/register"];
```

**Current Configuration** (as of November 2025):

- Protected routes: `/grammar/exercises`, `/edit_info`
- Unauth-only routes: `/auth/login`, `/auth/register`

## API Route Helpers

While this global middleware handles page-level redirects, **API routes** use middleware wrappers for authentication and validation:

### `withAuth` - Authentication & Authorization

Use `withAuth` from `src/backend/middleware/withAuth.js` to enforce auth in API route handlers:

```js
import { withAuth } from "@/backend/middleware/withAuth";

// Require any authenticated user
export const GET = withAuth(async (request, { params }) => {
  const user = request.user; // populated by withAuth
  return new Response("ok");
});

// Require admin
export const POST = withAuth(
  async (request) => {
    // request.user.is_admin is true here
    return new Response("admin ok");
  },
  { requireAuth: true, requireAdmin: true }
);
```

**Options**:

- `requireAuth` (default `true`): When `true`, unauthenticated requests receive `401`.
- `requireAdmin` (default `false`): When `true`, non-admin users receive `401`.

### `withInputValidation` - Request Body Validation

Use `withInputValidation` from `src/backend/middleware/withInputValidation.js` to validate request bodies with Zod schemas:

```js
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
});

export const POST = withInputValidation(schema, async (req) => {
  const body = await req.json(); // validated data
  return new Response(JSON.stringify({ success: true }));
});
```

### Composing Middleware

Combine both for authenticated routes with validation:

```js
export const POST = withAuth(
  withInputValidation(schema, async (req) => {
    const user = req.user; // from withAuth
    const data = await req.json(); // validated by withInputValidation
    // ...
  }),
  { requireAdmin: true }
);
```

For detailed API middleware documentation, see [BACKEND_MIDDLEWARE.md](src/backend/middleware/BACKEND_MIDDLEWARE.md).

## Notes

- If an unauthenticated user tries to access a protected page, they will be redirected to the login page. After logging in successfully, the user will be redirected back to the protected page (via the `redirect` query parameter).
- This middleware runs on the **edge runtime** and cannot access client-side state or React hooks.
- For API routes, use the `withAuth` and `withInputValidation` wrappers instead (see [API Route Helpers](#api-route-helpers) above).
- Session verification uses the `AUTH_COOKIE_NAME` cookie (defined in `src/shared/const.js`).
