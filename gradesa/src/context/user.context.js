"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRequest } from "../shared/hooks/useRequest";
import useLocalStorage from "@/shared/utils/useLocalStorage";

export const userOptions = [
  { label: "Student", value: "user" },
  { label: "Lehrer", value: "admin" },
];

// Define the default user state
const defaultUserState = {
  isLoggedIn: false,
  user: {
    id: null,
    username: null,
    email: null,
    is_admin: false,
  },
};

// Create the context
const UserContext = createContext({
  user: defaultUserState,
  actAs: userOptions[0],
});

// Create a provider component
/**
 * UserProvider - React context provider that supplies authentication state
 * and helper actions to the component tree.
 *
 * @param {{children: import('react').ReactNode}} props
 * @returns {JSX.Element} The provider wrapping `children`.
 */
export function UserProvider({ children }) {
  const [auth, setAuth] = useState(defaultUserState);
  const makeRequest = useRequest();
  const pathname = usePathname();
  const [actAs, setActAs, clearActAs] = useLocalStorage(
    "gradesa_act_as",
    userOptions[0]
  );
  // Check if user is logged in on initial load
  /**
   * resetAuthState - reset authentication state to defaults and clear
   * persisted `actAs` selection from local storage.
   *
   * @returns {void}
   */
  const resetAuthState = () => {
    setAuth(defaultUserState);
    clearActAs();
  };

  useEffect(() => {
    /**
     * checkUserSession - internal helper to call `/auth/session` and
     * update the `auth` state accordingly. Allows HTTP 401 responses to
     * be handled gracefully (treated as not logged in).
     *
     * @returns {Promise<void>} resolves when the session check finishes.
     */
    async function checkUserSession() {
      try {
        const response = await makeRequest("/auth/session", undefined, {
          method: "GET",
        }).catch((e) => {
          // Allow 401s
          if (e.status !== 401) {
            throw e;
          }
          return e;
        });
        if (response.status === 200 && response.data) {
          const user = response.data.user;
          setAuth((prev) => ({
            ...prev,
            isLoggedIn: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              is_admin: user.is_admin,
            },
          }));
        } else {
          console.debug("not logged in, resetting state");
          resetAuthState();
        }
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      }
    }
    checkUserSession();
  }, [pathname]);

  /**
   * logout - perform logout request and reset client state on success.
   * If the server responds with status 200 the local auth state is reset
   * and the page is reloaded to clear any cached state.
   *
   * @returns {Promise<void>} resolves when the logout completes.
   */
  const logout = async () => {
    const response = await makeRequest("/auth/logout");
    if (response.status === 200) {
      console.debug("User logged out");
      resetAuthState();
      window.location.reload();
    }
  };

  return (
    <UserContext.Provider value={{ auth, logout, setActAs, actAs }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
/**
 * useUser - React hook to access the `UserContext`.
 *
 * @returns {{auth: object, logout: function, setActAs: function, actAs: object}}
 * The value provided by `UserProvider`.
 */
export function useUser() {
  return useContext(UserContext);
}

/**
 * useIsLoggedIn - hook that returns whether the current user is logged in.
 *
 * @returns {boolean} `true` when a session is active, otherwise `false`.
 */
export function useIsLoggedIn() {
  const { auth } = useUser();
  return auth?.isLoggedIn ?? false;
}

/**
 * useLoggedOutGuard - redirect guard for routes that should be visible
 * only to logged-out users. When called inside a component it will
 * navigate to `/` if the user is already authenticated.
 *
 * @returns {void}
 */
export const useLoggedOutGuard = () => {
  const { auth } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (auth?.isLoggedIn) router.replace("/");
  }, [auth, router]);
};

/**
 * useIsAdmin - hook that enforces admin-only access to a route and returns
 * whether the current user has admin privileges. The hook will redirect
 * non-admin users to the root (`/`) when used inside a component.
 *
 * @returns {boolean|undefined} `true` if current user is admin, `false`
 * if not an admin, or `undefined` when there is no authenticated user yet.
 */
export function useIsAdmin() {
  const router = useRouter();
  const pathname = usePathname();
  const { auth, actAs } = useUser();

  useEffect(() => {
    if (!auth.user?.id) return;
    if (!auth.user?.is_admin || !auth.isLoggedIn || actAs.value !== "admin") {
      console.debug("Not authorized to view admin page", auth);
      router.replace("/");
    }
  }, [auth, router, pathname]);

  return auth?.user?.id ? auth.user.is_admin : undefined;
}

/**
 * checkUseIsAdmin - utility that inspects the current `UserContext` and
 * returns a boolean indicating admin rights.
 *
 * Note: this function relies on `useUser()` so it must be called from
 * React component or hook context (i.e. during render) to access the
 * current context value.
 *
 * @returns {boolean|undefined} `true` when user is admin, `false` when
 * not an admin, or `undefined` when there is no authenticated user.
 */
export function checkUseIsAdmin() {
  let is_admin = true;
  const { auth, actAs } = useUser();

  if (!auth.user?.id) return;
  if (!auth.user?.is_admin || !auth.isLoggedIn || actAs.value == "admin") {
    is_admin = false;
    // Evaluate the truth of this statement.
    // Should be true if and only if the user has admin rights
    // Find out what is the definition of an admin user
    // Also these functions might be better if they used whitelisting instead of blacklisting
  }

  return is_admin;
}
