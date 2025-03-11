import Link from "next/link";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link href="/">
          <h2>Deutch lerner</h2>
        </Link>
      </div>
      <div className="nav-links"></div>
      <div className="nav-auth">
        <button className="login-btn">
          <Link href="/auth/login">Anmelden</Link>
        </button>
        <button className="signup-btn">
          <Link href="/auth/register">Registrieren</Link>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
