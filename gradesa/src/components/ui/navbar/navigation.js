"use client";
import "./navbar.css";
import { useRouter } from "next/navigation";
import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push("/auth/login");
  };

  return (
    <nav className="navbar">
      {/* Layout UI */}
      <div className="navbar-right nav-links">
        {isLoggedIn ? (
          <button onClick={logout} className="auth-button">
            <LockOpen1Icon /> Abmeldung
          </button>
        ) : (
          <button onClick={handleLogin} className="auth-button">
            <LockClosedIcon /> Anmeldung
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
