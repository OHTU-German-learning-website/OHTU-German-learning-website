"use client";
import ".//page.css";
import { useIsLoggedIn } from "@/context/user.context";

export default function AuthLayout({ children }) {
  const userLoggedIn = useIsLoggedIn();

  if (userLoggedIn == true) {
    console.log(userLoggedIn);
    return (
      <div className="auth-container">
        <div className="auth-box">{children}</div>
      </div>
    );
  }
}
