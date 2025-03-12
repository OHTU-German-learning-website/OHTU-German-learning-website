"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./navbar.css";
import { LockClosedIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkUserSession() {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.loggedIn);
      }
    }
    checkUserSession();
  }, []);

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
