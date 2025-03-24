"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  setUser: () => {},
  logout: () => {},
});

// Create a provider component
export function UserProvider({ children }) {
  const [auth, setAuth] = useState(defaultUserState);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // TODO: actual check
        setAuth({
          isLoggedIn: true,
          actAs: defaultUserState.actAs,
          user: {
            id: "1",
            username: "Admin",
            email: "admin@gradesa.com",
            is_admin: true,
          },
        });
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      }
    };

    checkUserSession();
  }, []);

  const setActAs = (actAs) => {
    setAuth({ ...auth, actAs });
  };

  // Logout function
  const logout = async () => {
    try {
      // TODO: actual logout
      setAuth(defaultUserState);
    } catch (error) {
      console.error("Logout failed:", error);
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
  const { auth, logout, setActAs } = useContext(UserContext);
  return { auth, logout, setActAs };
}

export function useAdminGuard() {
  const router = useRouter();
  const { auth } = useUser();

  useEffect(() => {
    console.log(auth);
    if (
      !auth.user.is_admin ||
      !auth.isLoggedIn ||
      auth.actAs.value !== "admin"
    ) {
      router.replace("/");
    }
  }, [auth, router]);
}
