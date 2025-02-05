import Image from 'next/image'
import Link from 'next/link'
import "./sidebar.css";

const Sidebar = () => {
    return (
        <nav className="sidebar">
            {/* Layout UI */}
            <div className='sidebar-left'>
                <h2>Lernen</h2>
            </div>

            <div className="sidebar-left nav-links">
                <Link href="#">Benutzer</Link> <br />
                <Link href="#">Sich abmelden</Link>
            </div>
        </nav>
    );
};

export default Sidebar;
