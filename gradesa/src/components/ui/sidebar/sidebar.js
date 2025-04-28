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
      <SidebarGroup title="Links" sublinks={extraLinks} topLink="#" />
    </>
  );
}

const extraLinks = [
  {
    title: "Glossar",
    linkLabel: "Glossar",
    link: "/glossary",
    id: "glossary",
  },
  {
    title: "DeepL",
    linkLabel: "DeepL",
    link: "https://www.deepl.com/de/translator",
    id: "deepl",
  },
  {
    title: "Google Translator",
    linkLabel: "Google Translator",
    link: "https://translate.google.com/",
    id: "google-translator",
  },
  {
    title: "ChatGPT",
    linkLabel: "ChatGPT",
    link: "https://chatgpt.com/",
    id: "chatgpt",
  },
  {
    title: "Google Gemini",
    linkLabel: "Google Gemini",
    link: "https://gemini.google.com",
    id: "google-gemini",
  },
  {
    title: "Wortschatz Uni Leipzig",
    linkLabel: "Wortschatz Uni Leipzig",
    link: "https://wortschatz.uni-leipzig.de/de",
    id: "wortschatz-uni-leipzig",
  },
  {
    title: "Digitales Wörterbuch der Deutschen Sprache",
    linkLabel: "Digitales Wörterbuch der Deutschen Sprache",
    link: "https://www.dwds.de/",
    id: "digitales-woerterbuch-der-deutschen-sprache",
  },
  {
    title: "Institut für Deutsche Sprache",
    linkLabel: "Institut für Deutsche Sprache",
    link: "https://www.ids-mannheim.de/",
    id: "institut-fuer-deutsche-sprache",
  },
  {
    title: "Gesellschaft für Deutsche Sprache",
    linkLabel: "Gesellschaft für Deutsche Sprache",
    link: "https://gfds.de/",
    id: "gesellschaft-fuer-deutsche-sprache",
  },
  {
    title: "Grammis",
    linkLabel: "Grammis",
    link: "https://grammis.ids-mannheim.de/",
    id: "grammis",
  },
  {
    title: "Progr@mm",
    linkLabel: "Progr@mm",
    link: "https://grammis.ids-mannheim.de/progr@mm",
    id: "progr@mm",
  },
  {
    title: "Hamburger Fernhochschule",
    linkLabel: "Hamburger Fernhochschule",
    link: "https://www.hfh-fernstudium.de/blog/welcher-lerntyp-bist-du",
    id: "hamburger-fernhochschule",
  },
  {
    title: "IQLingua",
    linkLabel: "IQLingua",
    link: "https://www.iq-lingua.de/typ-checks/welcher-lerntyp-bin-ich/#c42954",
    id: "iq-lingua",
  },
  {
    title: "Geolino",
    linkLabel: "Geolino",
    link: "https://www.geo.de/geolino/mensch/5849-rtkl-lernen-welcher-lerntyp-bist-du",
    id: "geolino",
  },
  {
    title: "Kapiert.de",
    linkLabel: "Kapiert.de",
    link: "https://www.kapiert.de/lerntypentest/",
    id: "kapiert-de",
  },
];

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
