"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { chapters } from "@/app/resources/[chapter]/page";
import { Column } from "../layout/container";
const Sidebar = () => {
  const pathname = usePathname();
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
      <Column gap="xl">
        <SidebarGroup title="Lernen" sublinks={chapters} />
        <Link
          className={[
            styles.sidebarLink,
            pathname === "/vocabulary" ? styles.active : "",
          ].join(" ")}
          href="/vocabulary"
        >
          Vokabeln
        </Link>
      </Column>
    </nav>
  );
};

function SidebarGroup({ title, sublinks }) {
  const pathname = usePathname();
  const renderSublinks = () => {
    return sublinks.map((sublink) => (
      <Link
        className={[
          styles.sublink,
          pathname === sublink.link ? styles.active : "",
        ].join(" ")}
        key={sublink.id}
        href={sublink.link}
      >
        Kapitel {sublink.id}
      </Link>
    ));
  };

  return (
    <div className={styles.sidebarGroup}>
      <Link
        href="/resources"
        className={[
          styles.sidebarLink,
          pathname === "/resources" ? styles.active : "",
        ].join(" ")}
      >
        {title}
      </Link>
      <div className={styles.sublinkContainer}>{renderSublinks()}</div>
    </div>
  );
}

export default Sidebar;
