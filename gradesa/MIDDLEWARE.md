# Middleware Documentation

This document explains the purpose and functionality of the middleware located in `src/middleware.js`.

## Table of Contents

1. [Purpose](#purpose)
2. [How It Works](#how-it-works)
3. [Configuration](#configuration)
4. [Examples](#examples)
5. [Notes](#notes)

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

   - If the user is **not logged in** and tries to access a route in `authRequired`, they are redirected to the login page (`/auth/login`).
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

```
const authRequired = ["/dashboard", "/profile", "/lessons/exercises"];
```

To restrict a route so that logged-in users cannot access it, add the route to `unauthRequired`:

```
const unauthRequired = ["/auth/login", "/auth/register"];
```

## Notes

- If an unauthenticated user tries to access a protected page, they will be redirected to the login page. After logging in successfully, the user will be redirected back to the protected page.
- Middleware cannot access client-side state or hooks.
