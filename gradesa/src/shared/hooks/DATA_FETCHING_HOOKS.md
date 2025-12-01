# Data Fetching Hooks

_Last Updated: November 30, 2025_

## Recommendation: Consider React Query for new work

The hooks in this folder provide compact, easy-to-read utilities for data fetching, but they lack advanced features (robust caching, cache invalidation, complex retries). For new features or larger refactors, consider [TanStack Query (React Query)](https://tanstack.com/query) to get better caching, devtools, and mutation handling.

## Overview

This directory contains two custom hooks for making network requests to API routes:

- **`useQuery`** - GET requests with loading states and retries
- **`useRequest`** - POST/PUT/DELETE requests with flexible configuration

## useQuery

`useQuery` is a data fetching hook for making GET requests to the API with built-in error handling, loading states, and retries.

### Features

- Automatic GET requests with query string parameter handling
- Loading state management
- Basic error handling with structured error objects
- Automatic retries with exponential backoff on failure
- Request cancellation on component unmount (prevents memory leaks)
- Session ID tracking via custom header (`X-Session-Id`) for request tracing

### Usage

```jsx
import useQuery from "@/shared/hooks/useQuery";

function MyComponent() {
  const { data, error, isLoading, refetch } = useQuery(
    "/endpoint",
    {
      param1: "value1",
      param2: "value2",
    },
    {
      enabled: true,
      refetchBackoffMax: 10000,
      refetchBackoff: 1000,
      refetchBackoffExponent: 1.5,
      refetchBackoffMaxAttempts: 3,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh Data</button>
      {/* Render data */}
    </div>
  );
}
```

### Error handling

The `error` object is a structured object (e.g. `{ message, status, data }`). Use `error.message` for user-friendly messages and inspect `error.status`/`error.data` for debugging.

### Session ID tracking

Both hooks attach an `X-Session-Id` header (generated once per page load and stored in `sessionStorage`) to help correlate frontend requests with backend logs. This is added in the shared Axios instance via an interceptor.

### Parameters

- `url` (string): The API endpoint to fetch data from
- `params` (object, optional): Query parameters to send with the request
- `config` (object, optional): Configuration options:
  - `enabled` (boolean): Whether the query should automatically run (default: `true`)
  - `refetchBackoff` (number): Initial backoff time in ms (default: `1000`)
  - `refetchBackoffMax` (number): Maximum backoff time in ms (default: `10000`)
  - `refetchBackoffExponent` (number): Backoff exponential factor (default: `1.5`)
  - `refetchBackoffMaxAttempts` (number): Maximum retry attempts (default: `3`)

### Return Values

- `data`: The response data (null until loaded)
- `error`: Any error that occurred during fetching (null if no error)
- `isLoading`: Boolean indicating if the request is in progress
- `refetch`: Function to manually trigger the request again

## useRequest

`useRequest` is a flexible hook for making non-GET HTTP requests (POST, PUT, DELETE, etc.) to the API. Returns a function that can be called multiple times.

### Features

- Support for all HTTP methods (POST, PUT, DELETE, PATCH)
- Customizable request configuration (headers, auth, etc.)
- Structured error handling with status codes
- Session ID tracking (same as `useQuery`)
- Promise-based API for async/await usage

### Usage

```jsx
import { useRequest } from "@/shared/hooks/useRequest";

function MyComponent() {
  const makeRequest = useRequest();

  const handleSubmit = async (formData) => {
    try {
      const response = await makeRequest("/endpoint", formData, {
        method: "POST",
        headers: {
          "Custom-Header": "value",
        },
      });

      // Handle successful response
      console.log(response.data);
    } catch (error) {
      // Handle error
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form inputs */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Parameters

- The hook returns a `makeRequest` function that accepts:
  - `url` (string): The API endpoint (relative or absolute)
  - `body` (object, optional): The request body/payload (will be JSON stringified)
  - `config` (object, optional): Axios request configuration
    - `method` (string): HTTP method (default: 'POST')
    - `headers` (object): Custom request headers
    - `timeout` (number): Request timeout in milliseconds
    - Any other valid Axios request options

### Return Values

- Returns a Promise that resolves to the Axios response object:
  - `response.data` - Response body
  - `response.status` - HTTP status code
  - `response.headers` - Response headers

### Abort Controller Example

For long-running requests, you can implement cancellation:

```jsx
import { useRequest } from "@/shared/hooks/useRequest";
import { useEffect, useRef } from "react";

function MyComponent() {
  const makeRequest = useRequest();
  const abortControllerRef = useRef(null);

  const handleSubmit = async (formData) => {
    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await makeRequest("/api/process", formData, {
        method: "POST",
        signal: abortControllerRef.current.signal,
      });
      console.log("Success:", response.data);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request cancelled");
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  useEffect(() => {
    // Cleanup: cancel request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return <button onClick={handleSubmit}>Submit</button>;
}
```

## Implementation Details

### Axios Configuration

Both hooks use a shared Axios instance configured in `axios-config.js`:

- **Base URL**: Automatically uses the current domain (no hardcoded URLs)
- **Content-Type**: Set to `application/json` by default
- **Interceptors**: Request interceptor adds `X-Session-Id` header
- **Error handling**: Response interceptor structures error objects

### Base URL Behavior

```javascript
// Relative URLs resolve to current domain:
await makeRequest("/api/users", data); // → https://current-domain.com/api/users

// Absolute URLs work as expected:
await makeRequest("https://external-api.com/data", data); // → https://external-api.com/data
```

## Migration note

If you decide to migrate to React Query, focus on replacing `useQuery` call-sites with `useQuery`/`useMutation` from `@tanstack/react-query` and centralizing side-effects through query keys and invalidations. The hooks here show the minimal surface you'll need to map over.

## Best Practices

1. **Use `useQuery` for GET requests**: It handles loading states and retries automatically
2. **Use `useRequest` for mutations**: POST/PUT/DELETE operations that change data
3. **Handle errors explicitly**: Always check for `error` before rendering data
4. **Set `enabled: false` for conditional queries**: Prevents automatic fetching
5. **Cancel requests on unmount**: Already handled by `useQuery`, implement manually for `useRequest` if needed
6. **Consider React Query for new features**: Better caching, invalidation, and state management
