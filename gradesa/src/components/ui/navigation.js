"use client";

import Image from "next/image";
import Link from "next/link";
import "./navbar.css";

const Navbar = () => {
  const logout = () => {
    console.log("logout");
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  };
  return (
    <nav className="navbar">
      {/* Layout UI */}
      <div className="navbar-left">
        <Image
          src="/logo_placeholder.png"
          width={190}
          height={140}
          alt="Logo placeholder"
          priority={true}
        />
      </div>

      <div className="navbar-center nav-links">
        <Link href="#">Benutzer</Link>
        <button onClick={logout}>Sich abmelden</button>
      </div>
    </nav>
  );
};

export default Navbar;
