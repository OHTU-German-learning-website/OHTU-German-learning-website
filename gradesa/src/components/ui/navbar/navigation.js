import Link from "next/link";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link href="/">
          <h2>Learn German</h2>
        </Link>
      </div>
      <div className="nav-links">
        <Link href="/learning">Courses</Link>
        <a>Modules</a>
        <a>For Teachers</a>
        <a>Learning Environment</a>
        <a>Research</a>
        <a>About Us</a>
      </div>
      <div className="nav-auth">
        <button className="login-btn">
          <Link href="/auth/login">Login</Link>
        </button>
        <button className="signup-btn">
          <Link href="/auth/register">Sign Up</Link>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
