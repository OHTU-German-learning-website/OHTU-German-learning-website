import Image from "next/image";
import Link from "next/link";
import "./navbar.css";
import { LockClosedIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Layout UI */}
      <div className="navbar-right nav-links">
        <Link href="/auth/login">
          <LockClosedIcon /> Anmeldung
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
