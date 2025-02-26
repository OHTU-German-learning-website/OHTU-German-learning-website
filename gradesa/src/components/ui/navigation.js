import Image from "next/image";
import Link from "next/link";
import "./navbar.css";

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
        <Link href="#">Benutzer</Link>
        <Link href="#">Sich abmelden</Link>
      </div>
    </nav>
  );
};

export default Navbar;
