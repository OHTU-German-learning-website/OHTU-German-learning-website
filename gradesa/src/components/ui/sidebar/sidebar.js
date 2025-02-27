"use client";

import Link from "next/link";
import styles from "./sidebar.module.css";

const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
      <div>
        <h1 className={styles.logo}>Gradesa</h1>
      </div>
      <div className={styles.sidebarLinks}>
        <div className={styles.navItem}>
          <Link className={styles.sidebarLink} href="/learning">
            Lernen
          </Link>
        </div>
        <div className={styles.navItem}>
          <Link className={styles.sidebarLink} href="/vocabulary">
            Vokabeln
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
