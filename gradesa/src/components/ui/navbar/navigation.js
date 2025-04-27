"use client";
import Link from "next/link";
import Image from "next/image";
import "./navbar.css";
import { useUser } from "@/context/user.context";
import { Column } from "../layout/container";
import { useRouter } from "next/navigation";

function Navbar() {
  const { auth, logout } = useUser();
  const router = useRouter();

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
          {auth.isLoggedIn ? (
            <>
              <Column justify="between" gap="xs">
                <span className="logged-in-label">Eingeloggt als</span>
                <span className="username">{auth.user.username}</span>
              </Column>
              <button
                onClick={() => router.push("/edit_info")}
                className="login-btn"
              >
                Profil
              </button>
              <button onClick={logout} className="login-btn">
                Abmeldung
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="login-btn">Anmeldung</button>
              </Link>
              <Link href="/auth/register">
                <button className="signup-btn">Registrieren</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
