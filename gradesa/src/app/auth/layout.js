import { Suspense } from "react";
import "./auth.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="auth-box">{children}</div>
      </Suspense>
    </div>
  );
}
