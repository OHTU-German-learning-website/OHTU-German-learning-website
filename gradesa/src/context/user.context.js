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
export function UserProvider({ children }) {
  const [auth, setAuth] = useState(defaultUserState);
  const makeRequest = useRequest();
  const pathname = usePathname();
  const [actAs, setActAs, clearActAs] = useLocalStorage(
    "gradesa_act_as",
    userOptions[0]
  );
  // Check if user is logged in on initial load
  const resetAuthState = () => {
    setAuth(defaultUserState);
    clearActAs();
  };
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
          resetAuthState();
        }
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      }
    }
    checkUserSession();
  }, [pathname]);

  // Logout function
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
export function useUser() {
  return useContext(UserContext);
}

export function useIsLoggedIn() {
  const { auth } = useUser();
  return auth?.isLoggedIn ?? false;
}

export const useLoggedOutGuard = () => {
  const { auth } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (auth?.isLoggedIn) router.replace("/");
  }, [auth, router]);
};

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
