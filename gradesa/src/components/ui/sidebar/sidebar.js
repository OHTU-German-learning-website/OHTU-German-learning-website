"use client";

import Link from "next/link";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { chapters } from "@/app/resources/[chapter]/page";
import { Column } from "../layout/container";
import { Dropdown } from "../dropdown";
import { useUser, userOptions } from "@/shared/user.context";
import { Button } from "../button";

const Sidebar = () => {
  const { auth, setActAs } = useUser();

  const handleActAsChange = (actAs) => {
    setActAs(actAs);
  };
  const renderSidebar = () => {
    if (auth.actAs.value === "admin") {
      return <AdminSideBar />;
    }
    return <StudentSideBar />;
  };
  return (
    <nav className={styles.sidebar}>
      <Column gap="xl">
        <Dropdown
          options={userOptions}
          onSelect={handleActAsChange}
          value={auth.actAs}
        >
          <Button variant="outline">{auth.actAs.label}</Button>
        </Dropdown>
        {renderSidebar()}
      </Column>
    </nav>
  );
};

function StudentSideBar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup title="Lernen" sublinks={chapters} topLink="/resources" />
      <Link className={styles.sidebarLink} href="/grammar/communications">
        Kommunikations-situationen
      </Link>
      <Link
        className={[
          styles.sidebarLink,
          pathname === "/vocabulary" ? styles.active : "",
        ].join(" ")}
        href="/vocabulary"
      >
        Vokabeln
      </Link>
    </>
  );
}

const adminSidebarLinks = [
  {
    title: "Übungen erstellen",
    linkLabel: "Übungen erstellen",
    link: "/admin/create-exercise",
  },
];

function AdminSideBar() {
  const pathname = usePathname();
  return (
    <>
      <SidebarGroup
        title="Admin"
        sublinks={adminSidebarLinks}
        topLink="/admin"
      />
    </>
  );
}

function SidebarGroup({ title, sublinks, topLink }) {
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
        {sublink.linkLabel}
      </Link>
    ));
  };

  return (
    <div className={styles.sidebarGroup}>
      <Link
        href={topLink}
        className={[
          styles.sidebarLink,
          pathname === topLink ? styles.active : "",
        ].join(" ")}
      >
        {title}
      </Link>
      <div className={styles.sublinkContainer}>{renderSublinks()}</div>
    </div>
  );
}

export default Sidebar;
