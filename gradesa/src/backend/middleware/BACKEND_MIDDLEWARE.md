# Backend middleware (API helpers)

Last updated: November 30, 2025

This document summarizes the small set of middleware wrappers used by Next.js API route handlers. For implementation, see the source files in `gradesa/src/backend/middleware/`.

Key wrappers

- `withAuth` — enforces authentication (optionally admin-only) and attaches `request.user`.
- `withInputValidation` — validates request bodies using Zod schemas and attaches the parsed data to `request.body`.

Usage highlights

- Compose wrappers for common patterns. Example (authentication outside validation):

```js
// PUT endpoint: auth + validation
export const PUT = withAuth(
  withInputValidation(async (req) => {
    const user = req.user;
    const data = req.body;
    // ...
  }, updateProfileSchema)
);
```

- `withAuth` options: pass `{ isAdmin: true }` to require admin privileges.

Error responses

- `withAuth` returns `401` for missing/invalid session and `403` for insufficient privileges.
- `withInputValidation` returns `400` with a `details` array (Zod-style errors) for invalid input.

Testing

- Middleware tests live with other backend tests under `gradesa/src/backend/test/` (search for `withAuth` and `withInputValidation` tests).
- To run the app's unit tests from the repo root:

```bash
cd /host/gradesa
npm test
```

Notes

- Keep middleware small and focused; prefer composition over duplication.
- For handler-specific behavior (optional auth), inspect `request.user` directly in the handler instead of using `withAuth`.

See also: `gradesa/README.md` (root onboarding), and `gradesa/src/SOURCE_OVERVIEW.md` for a high-level map of source folders.
