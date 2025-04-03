# Middleware Documentation

This document provides an overview and usage examples for the middleware functions in the application.

## Table of Contents

1. [`withAuth`](#withAuth)
   - [Features](#features)
   - [Parameters](#parameters)
   - [Usage](#usage)
   - [Example Use-Cases](#example-use-cases)

## `withAuth`

The `withAuth` middleware provides authentication and authorization for API route handlers. It wraps route handlers to check if the user has an active session and optionally verifies admin privileges.

### Features

- Verifies user authentication status
- Optionally enforces admin-only access
- Attaches the user object to the request for use in the handler
- Returns appropriate error responses for unauthorized requests

### Parameters

- `callback`: The route handler function to be wrapped
- `options`: Configuration object with the following properties:
  - `requireAuth`: Boolean (default: `true`) - Whether authentication is required
  - `requireAdmin`: Boolean (default: `false`) - Whether admin privileges are required

### Usage

import { NextResponse } from "next/server";
import { withAuth } from "@/backend/middleware/withAuth";

```js
// Protected GET endpoint example
export const GET = withAuth(async (request, { params }) => {
  // Retrieve the authenticated user added to the request by withAuth
  const user = request.user;

  return NextResponse.json({
    message: "Protected GET route accessed successfully",
    user,
  });
});

// Admin-only POST endpoint example
export const POST = withAuth(
  async (request) => {
    // Implement admin-specific logic here.
    return NextResponse.json({
      message: "Admin-only route accessed successfully",
    });
  },
  { requireAdmin: true }
);
```
