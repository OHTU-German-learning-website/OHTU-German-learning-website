'use client'

import { useState } from 'react';
import Link from 'next/link'
import "./sidebar.css";

const Sidebar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="sidebar">
            {/* Layout UI */}
            <div className='sidebar-left'>
                <h2>Lernen</h2>
            </div>

            <div className="sidebar-left nav-links">
                <div className="dropdown">
                    <button onClick={toggleDropdown} className="dropdown-button">
                        Lektionen
                    </button>
                    {/* Dropdown list items */}
                    {isDropdownOpen && (
                    <div className="dropdown-menu">    
                        <Link href="#">Grammatik 1</Link> <br />
                        <Link href="#">Grammatik 2</Link>
                    </div>               
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
