import "./auth.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <div className="auth-box">{children}</div>
    </div>
  );
}
