"use client";

import Link from "next/link";
import "./navbar.css";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="navbar">
      {/* Layout UI */}
      <div className="navbar-right nav-links">
        {isLoggedIn ? (
          <Link href="/auth/logout">
            <LockClosedIcon /> Abmeldung
          </Link>
        ) : (
          <Link href="/auth/login">
            <LockClosedIcon /> Anmeldung
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
