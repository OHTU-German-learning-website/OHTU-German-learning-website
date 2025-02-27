import Image from "next/image";
import Link from "next/link";
import "./navbar.css";
import { LockClosedIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Layout UI */}
      <div className="navbar-left">
        <Link href="/">
          <Image
            src="/logo_placeholder2.png"
            width={240}
            height={179}
            alt="Logo placeholder"
            priority={true}
          />
        </Link>
      </div>

      <div className="navbar-center nav-links">
        <Link href="/auth/login">
          <LockClosedIcon /> Anmeldung
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
