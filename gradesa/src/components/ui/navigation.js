import Image from 'next/image'
import Link from 'next/link'
import "./navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* Layout UI */}
            <div className='navbar-left'>
                <Image 
                src="/logo_placeholder.png"
                width={190}
                height={140}
                alt="Logo placeholder"
                />
            </div>

            <div className="navbar-center nav-links">
                <Link href="#">Benutzer</Link>
                <Link href="#">Sich abmelden</Link>
            </div>
        </nav>
    );
};

export default Navbar;
