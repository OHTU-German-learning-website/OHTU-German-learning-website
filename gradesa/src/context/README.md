# Context

This project uses React Context to manage global state across the application. Below is an overview of the available contexts and their usage.

## Table of Contents

1. [`authContext`](#authcontext)
   - [Features](#features)
   - [Usage](#usage)
     - [Example Page](#example-page)
   - [Example Use-Cases](#example-use-cases)
   - [Notes](#notes)

## `authContext`

The `authContext` manages the user's authentication state. It determines whether the user has an active session and allows conditional rendering of content based on the user's login status.

### Features

- Tracks whether the user is logged in with `isLoggedIn`.
- Provides the utility function `logout` for logging out the user.

### Usage

To add authentication-dependent content to a page, follow these steps:

1. Import useAuth on the page with `import { useAuth } from "@/context/authContext";`
2. Define isLoggedIn constant in the page export function: `const { isLoggedIn } = useAuth();`
3. Insert `{isLoggedIn && ()}` in the return statement with protected content inside the parantheses.

#### Example Page:

```
import { useAuth } from "@/context/authContext";

export default function Page() {
  const { isLoggedIn } = useAuth();

  return (
    <div>
      {/* Public content */}
      {isLoggedIn && (
        <div>
          <p>Content visible to logged-in users only</p>
        </div>
      )}
      {/* Public content */}
    </div>
  );
}
```

### Example Use-cases

- **Logged-In Users**: Display protected content to logged-in users, such as exercises.
- **Logged-Out Users**: Show public content, or use `{isLoggedIn === false && ()}` to show exclusive content to logged-out users, such as a prompt to log in.

### Notes

- The `AuthProvider` is already configured in the `RootLayout` in `app/layout.js`, so `authContext` is available throughout the application. You can use the `useAuth` hook in any component or page without additional setup.
- The `authContext` interacts with the `/api/auth/session` endpoint to determine the user's session status and the `/api/auth/logout` endpoint to end the active session.
