"use client";

import Link from "next/link";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { chapters } from "@/app/resources/[chapter]/page";
import { Column } from "../layout/container";
import { Dropdown } from "../dropdown";
import { useUser, userOptions } from "@/context/user.context";
import { Button } from "../button";
import { useEffect, useState } from "react";
import { useIsMounted } from "@/shared/hooks/useIsMounted";
const Sidebar = () => {
  const { auth, setActAs, actAs } = useUser();

  const handleActAsChange = (actAs) => {
    setActAs(actAs);
  };

  const isMounted = useIsMounted();
  const renderSidebar = () => {
    if (!isMounted) return null;
    if (actAs.value === "admin") {
      return <AdminSideBar />;
    }
    return <StudentSideBar />;
  };
  return (
    <nav className={styles.sidebar}>
      <Column gap="xl">
        {auth.user.is_admin && (
          <Dropdown
            options={userOptions}
            onSelect={handleActAsChange}
            value={actAs}
          >
            <Button variant="outline">{actAs.label}</Button>
          </Dropdown>
        )}
        {renderSidebar()}
      </Column>
    </nav>
  );
};

function StudentSideBar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup
        title="Richtig Online Lernen"
        sublinks={chapters}
        topLink="/resources"
      />
      <Link className={styles.sidebarLink} href="/grammar/communications">
        Kommunikations-situationen
      </Link>
      <Link className={styles.sidebarLink} href="/talkback">
        Rückmeldekanal-Feedback channel
      </Link>
      <Dropdown
        options={[{ label: "Glossar", value: "/glossary" }]}
        trigger="click"
      >
        <Button variant="outline">Links</Button>
      </Dropdown>
    </>
  );
}

const adminSidebarLinks = [
  {
    title: "Übungen erstellen",
    linkLabel: "Übungen erstellen",
    link: "/admin/create-exercise",
    id: "create-exercise",
  },
  {
    title: "Glossareinträge",
    linkLabel: "Glossareinträge verwalten",
    link: "/admin/glossary",
    id: "glossary",
  },
];

function AdminSideBar() {
  return (
    <SidebarGroup title="Admin" sublinks={adminSidebarLinks} topLink="/admin" />
  );
}

function SidebarGroup({ title, sublinks, topLink }) {
  const pathname = usePathname();
  const renderSublinks = () => {
    return sublinks.map((sublink, i) => (
      <Link
        className={[
          styles.sublink,
          pathname === sublink.link ? styles.active : "",
        ].join(" ")}
        key={`${i}-${sublink.link}`}
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
