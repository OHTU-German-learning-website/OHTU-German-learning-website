"use client";

import { Suspense } from "react";
import "./auth.css";
import { useLoggedOutGuard } from "@/context/user.context";
export default function AuthLayout({ children }) {
  useLoggedOutGuard();
  return (
    <div className="auth-container">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="auth-box">{children}</div>
      </Suspense>
    </div>
  );
}
