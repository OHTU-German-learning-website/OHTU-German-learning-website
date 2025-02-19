"use client";

import { useState } from "react";
import Link from "next/link";
import "./sidebar.css";
import { Dropdown } from "@/components/ui/dropdown/dropdown";
import { Button } from "@/components/ui/button/button";

const Sidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((previousState) => !previousState);
  };

  return (
    <nav className="sidebar">
      {/* Layout UI */}
      <div className="sidebar-left">
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
              <Link href="#">Grammatik 1</Link>
              <Link href="#">Grammatik 2</Link>
            </div>
          )}
        </div>
      </div>
      <Dropdown
        options={[
          {
            label: "Option 1",
            value: "option1",
          },
          {
            label: "Option 2",
            value: "option2",
          },
          {
            label: "Option 3",
            value: "option3",
            disabled: true,
          },
        ]}
      >
        <Button>Lektionen</Button>
      </Dropdown>
    </nav>
  );
};

export default Sidebar;
