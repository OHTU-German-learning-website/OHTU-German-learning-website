"use client";

import Link from "next/link";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { chapters } from "@/app/resources/[chapter]/page";
import { Column } from "../layout/container";
const Sidebar = () => {
  const pathname = usePathname();
  return (
    <nav className={styles.sidebar}>
      <Column gap="xl">
        <SidebarGroup title="Lernen" sublinks={chapters} />
        <Link className={styles.sidebarLink} href="/grammar/communications">
          Kommunikations-situationen
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
