# Application Contexts

_Last Updated: November 30, 2025_

This project uses React Context to manage global state across the application. Two main contexts are provided:

- **`UserProvider`** - Authentication state and user information
- **`GlossaryProvider`** - Glossary data with word lookup functionality

Both providers are configured in the root layout and available throughout the application.

## Table of Contents

1. [`userContext`](#usercontext)
   - [Features](#features)
   - [Available Hooks](#available-hooks)
   - [User Object Structure](#user-object-structure)
   - [Usage Examples](#usage-examples)
   - [Notes](#notes)
2. [`glossaryContext`](#glossarycontext)
   - [Features](#features-1)
   - [Available Hook](#available-hook)
   - [Usage Examples](#usage-examples-1)
   - [Notes](#notes-1)
3. [Testing with Contexts](#testing-with-contexts)

## `userContext`

The `userContext` manages the user's authentication state and user information. It provides authentication status, user details, and logout functionality.

### Features

- Tracks authentication state with `isLoggedIn` boolean
- Provides complete user object with profile information
- Offers `logout` function for ending sessions
- Automatically fetches session on mount
- Handles loading states during session checks

### Available Hooks

The `userContext` provides multiple hooks for accessing different parts of the state:

```javascript
import {
  useUser, // Full user object and logout function
  useIsLoggedIn, // Only authentication status boolean
} from "@/context/user.context";

// In component:
const { user, logout } = useUser(); // { user: {...}, logout: fn }
const isLoggedIn = useIsLoggedIn(); // boolean
```

### User Object Structure

When authenticated, the `user` object contains (example):

```javascript
{
  id: 1,
  username: "student123",
  isAdmin: false
  // Additional fields from the users table
}
```

When not authenticated, `user` is `null`.

### Usage Examples

#### Conditional Rendering Based on Authentication

```javascript
import { useIsLoggedIn } from "@/context/user.context";

export default function Page() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <div>
      {/* Public content */}
      <h1>Welcome</h1>

      {/* Content for authenticated users */}
      {isLoggedIn && (
        <div>
          <p>Content visible to logged-in users only</p>
        </div>
      )}

      {/* Content for non-authenticated users */}
      {!isLoggedIn && (
        <div>
          <p>Please log in to access exercises</p>
        </div>
      )}
    </div>
  );
}
```

#### Using User Information and Logout

```javascript
import { useUser } from "@/context/user.context";

export default function ProfilePage() {
  const { user, logout } = useUser();

  if (!user) {
    return <p>Please log in</p>;
  }

  const handleLogout = async () => {
    await logout();
    // User is logged out, context updates automatically
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
      {user.isAdmin && <p>Admin privileges active</p>}
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
```

#### Use Cases

- **Logged-In Users**: Display protected content like exercises, profile, admin panels
- **Logged-Out Users**: Show login prompts, public content, registration links
- **Admin Users**: Conditionally render admin-only features using `user.isAdmin`

### Notes

- The `UserProvider` is configured in the root layout (`app/layout.js`), so the context is available app-wide.
- The context fetches session data from `/api/auth/session` and calls `/api/auth/logout` to end sessions.
- Session checks run on mount; prefer hooks (`useUser`, `useIsLoggedIn`) to access the state.

## `glossaryContext`

The `glossaryContext` provides access to the application's glossary data, including word definitions and lookup functionality.

### Features

- Fetches and caches glossary entries on mount
- Provides word lookup by entry or inflected form
- Handles loading and error states
- Exposes raw entries array and optimized word map

### Available Hook

```javascript
import { useGlossary } from "@/context/glossary.context";

// In component:
const { entries, wordMap, isLoading, error } = useGlossary();
```

**Returns:**

- `entries` - Array of all glossary entries
- `wordMap` - Map for fast lookup: `{ word: entryId }`
- `isLoading` - Boolean indicating if data is being fetched
- `error` - Error object if fetch failed, null otherwise

### Usage Examples

#### Basic Glossary Display

```javascript
import { useGlossary } from "@/context/glossary.context";

export default function GlossaryPage() {
  const { entries, isLoading, error } = useGlossary();

  if (isLoading) return <p>Loading glossary...</p>;
  if (error) return <p>Failed to load glossary</p>;

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          <strong>{entry.word}</strong>: {entry.definition}
        </li>
      ))}
    </ul>
  );
}
```

### Notes

- The `GlossaryProvider` is configured in the root layout and available throughout the application.
- Glossary data is fetched from `/api/glossary` on mount.
- The `wordMap` enables O(1) lookup for both base forms and inflected forms of words.
- Use `isLoading` to show loading states and prevent rendering before data is available.

## Testing with Contexts

When testing components that use contexts, wrap them in the appropriate provider:

```javascript
import { render } from "@testing-library/react";
import { UserProvider } from "@/context/user.context";
import { GlossaryProvider } from "@/context/glossary.context";
import MyComponent from "./MyComponent";

test("renders with context", () => {
  render(
    <UserProvider>
      <GlossaryProvider>
        <MyComponent />
      </GlossaryProvider>
    </UserProvider>
  );

  // Test assertions...
});
```

### Mocking Context Values

For unit tests, mock the context hooks:

```javascript
import { vi } from "vitest";
import * as userContext from "@/context/user.context";

vi.spyOn(userContext, "useUser").mockReturnValue({
  user: { id: 1, username: "testuser", isAdmin: false },
  logout: vi.fn(),
});

vi.spyOn(userContext, "useIsLoggedIn").mockReturnValue(true);
```

This approach isolates component logic from context implementation.
