import Link from "next/link";
import Image from "next/image";
import "./navbar.css";

function Navbar() {
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
          <button className="login-btn">
            <Link href="/auth/login">Anmelden</Link>
          </button>
          <button className="signup-btn">
            <Link href="/auth/register">Registrieren</Link>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
