import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* Layout UI */}
            <div>
                <Image 
                src="/logo_placeholder.png"
                width={240}
                height={190}
                alt="Logo placeholder"
                />
                <h1>Here is the navigation!</h1>
            </div> 
            <ul className="nav-links">
                <li><Link href="#">Home</Link></li>
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Contact</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
