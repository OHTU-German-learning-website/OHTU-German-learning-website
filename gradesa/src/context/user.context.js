"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRequest } from "../shared/hooks/useRequest";

export const userOptions = [
  { label: "Student", value: "user" },
  { label: "Lehrer", value: "admin" },
];

// Define the default user state
const defaultUserState = {
  isLoggedIn: false,
  actAs: userOptions[0],
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
});

// Create a provider component
export function UserProvider({ children }) {
  const [auth, setAuth] = useState(defaultUserState);
  const makeRequest = useRequest();
  const pathname = usePathname();
  // Check if user is logged in on initial load
  useEffect(() => {
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
          setAuth(defaultUserState);
        }
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      }
    }
    checkUserSession();
  }, [pathname]);

  const setActAs = (actAs) => {
    setAuth({ ...auth, actAs });
  };

  // Logout function
  const logout = async () => {
    const response = await makeRequest("/auth/logout");
    if (response.ok) {
      console.debug("User logged out");
      setAuth(defaultUserState);
      window.location.reload();
    }
  };

  return (
    <UserContext.Provider value={{ auth, logout, setActAs }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  return useContext(UserContext);
}

export function useIsLoggedIn() {
  const { auth } = useUser();
  return auth?.isLoggedIn ?? false;
}

export function useAdminGuard() {
  const router = useRouter();
  const { auth } = useUser();
  useEffect(() => {
    if (
      !auth.user.is_admin ||
      !auth.isLoggedIn ||
      auth.actAs.value !== "admin"
    ) {
      console.debug("Not authorized to view admin page", auth);
      router.replace("/");
    }
  }, [auth, router]);
}
