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
        options={[
          { label: "Glossar", value: "#" },
          { label: "DeepL", value: "https://www.deepl.com/de/translator" },
          {
            label: "Google Translator",
            value: "https://translate.google.com/",
          },
          { label: "ChatGPT", value: "https://chatgpt.com/ " },
          { label: "Google Gemini", value: "https://gemini.google.com" },
          {
            label: "Wortschatz Uni Leipzig",
            value: "https://wortschatz.uni-leipzig.de/de",
          },
          {
            label: "Digitales Wörterbuch der Deutschen Sprache",
            value: "https://www.dwds.de/",
          },
          {
            label: "Institut für Deutsche Sprache",
            value: "https://www.ids-mannheim.de/",
          },
          {
            label: "Gesellschaft für Deutsche Sprache",
            value: "https://gfds.de/",
          },
          { label: "Grammis", value: "https://grammis.ids-mannheim.de/" },
          {
            label: "Progr@mm",
            value: "https://grammis.ids-mannheim.de/progr@mm",
          },
          {
            label: "Hamburger Fernhochschule",
            value:
              "https://www.hfh-fernstudium.de/blog/welcher-lerntyp-bist-du",
          },
          {
            label: "IQLingua",
            value:
              "https://www.iq-lingua.de/typ-checks/welcher-lerntyp-bin-ich/#c42954",
          },
          {
            label: "Geolino",
            value:
              "https://www.geo.de/geolino/mensch/5849-rtkl-lernen-welcher-lerntyp-bist-du",
          },
          {
            label: "Kapiert.de",
            value: "https://www.kapiert.de/lerntypentest/",
          },
        ]}
        trigger="click"
        onSelect={(option) => {
          window.location.href = option.value;
        }}
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
