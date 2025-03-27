"use client";
import Link from "next/link";
import Image from "next/image";
import "./navbar.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push("/auth/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="brand-container">
          <div className="logo">
            <Link href="/">
              <Image
                src="/logo_placeholder2.png"
                width={50}
                height={50}
                alt="Logo placeholder"
                priority={true}
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-links"></div>
        <div className="nav-auth">
          {isLoggedIn ? (
            <button onClick={logout} className="login-btn">
              Abmeldung
            </button>
          ) : (
            <button onClick={handleLogin} className="login-btn">
              Anmeldung
            </button>
          )}
          <button className="signup-btn">
            <Link href="/auth/register">Registrieren</Link>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
