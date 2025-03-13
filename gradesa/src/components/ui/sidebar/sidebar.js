"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./sidebar.module.css";

const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
      <div className="logo">
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
      <div className={styles.sidebarLinks}>
        <div className={styles.navItem}>
          <Link className={styles.sidebarLink} href="/resources">
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
