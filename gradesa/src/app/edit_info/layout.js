"use client";
import "../auth/auth.css";
import { useIsLoggedIn } from "@/context/user.context";

export default function AuthLayout({ children }) {
  const userLoggedIn = useIsLoggedIn();

  if (userLoggedIn == true) {
    return (
      <div className="auth-container">
        <div className="auth-box">{children}</div>
      </div>
    );
  }
}
