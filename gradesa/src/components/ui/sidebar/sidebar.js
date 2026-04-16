"use client";

import Link from "next/link";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { Column } from "../layout/container";
import { Dropdown } from "../dropdown";
import {
  useUser,
  STUDENT_OPTION,
  TEACHER_OPTION,
  ADMIN_OPTION,
} from "@/context/user.context";
import { Button } from "../button";
import { useEffect, useState } from "react";
import { useIsMounted } from "@/shared/hooks/useIsMounted";

const Sidebar = () => {
  const { auth, setActAs, actAs } = useUser();

  const handleActAsChange = (selectedActAs) => {
    setActAs(selectedActAs);
  };

  const isMounted = useIsMounted();

  /**
   * Return only the role options that the current user is allowed to use.
   *
   * - students: Student
   * - teachers: Student, Lehrer
   * - admins/superadmins: Student, Lehrer, Administrator
   */
  const getAvailableUserOptions = () => {
    if (!auth.user.is_admin) {
      return [STUDENT_OPTION];
    }

    if (auth.user.is_superadmin) {
      return [STUDENT_OPTION, TEACHER_OPTION, ADMIN_OPTION];
    }

    return [STUDENT_OPTION, TEACHER_OPTION];
  };

  const renderSidebar = () => {
    if (!isMounted) return null;

    if (actAs.value === "superadmin" && auth.user.is_superadmin) {
      return <AdminSideBar showUsers={true} />;
    }

    if (auth.user.is_admin && actAs.value === "admin") {
      return <AdminSideBar showUsers={false} />;
    }
    return <StudentSideBar />;
  };

  return (
    <nav className={styles.sidebar}>
      <Column gap="xl">
        {auth.isLoggedIn && (
          <Dropdown
            options={getAvailableUserOptions()}
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
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    fetch("/api/pages/resources")
      .then((res) => res.json())
      .then((data) => {
        setChapters(
          data.pages.map((p) => {
            return {
              title: p.title,
              link: `/pages/resources/${p.slug}`,
            };
          })
        );
      })
      .catch(() => {
        // Silently handle errors (e.g., no resources pages exist yet)
        setChapters([]);
      });
  }, []);

  return (
    <>
      <SidebarGroup
        title="Effektiv online lernen"
        sublinks={chapters}
        topLink="/pages/resources"
        collapsible
      />
      <Link className={styles.sidebarLink} href="/pages/communications">
        Kommunikations-situationen
      </Link>
      <Link className={styles.sidebarLink} href="/grammar/themes">
        Themen der Grammatik
      </Link>
      <Link className={styles.sidebarLink} href="/talkback">
        Rückmeldekanal-Feedback geben
      </Link>
      <SidebarGroup
        title="Links zu anderen Webseiten"
        sublinks={extraLinks}
        topLink="#"
      />
    </>
  );
}

const extraLinks = [
  {
    title: "Wortschatz Uni Leipzig",
    link: "https://wortschatz.uni-leipzig.de/de",
    id: "wortschatz-uni-leipzig",
  },
  {
    title: "Digitales Wörterbuch der Deutschen Sprache",
    link: "https://www.dwds.de/",
    id: "digitales-woerterbuch-der-deutschen-sprache",
  },
  {
    title: "Institut für Deutsche Sprache",
    link: "https://www.ids-mannheim.de/",
    id: "institut-fuer-deutsche-sprache",
  },
  {
    title: "Gesellschaft für Deutsche Sprache",
    link: "https://gfds.de/",
    id: "gesellschaft-fuer-deutsche-sprache",
  },
  {
    title: "Grammis",
    link: "https://grammis.ids-mannheim.de/",
    id: "grammis",
  },
  {
    title: "Progr@mm",
    link: "https://grammis.ids-mannheim.de/progr@mm",
    id: "progr@mm",
  },
  {
    title: "DeepL",
    link: "https://www.deepl.com/de/translator",
    id: "deepl",
  },
  {
    title: "Google Translator",
    link: "https://translate.google.com/",
    id: "google-translator",
  },
  {
    title: "ChatGPT",
    link: "https://chatgpt.com/",
    id: "chatgpt",
  },
  {
    title: "Google Gemini",
    link: "https://gemini.google.com",
    id: "google-gemini",
  },
];

const adminSidebarLinks = [
  {
    title: "Übungen erstellen",
    link: "/admin/create-exercise",
    id: "create-exercise",
  },
  {
    title: "Glossareinträge",
    link: "/admin/glossary",
    id: "glossary",
  },
  {
    title: "Benutzer",
    link: "/admin/users",
    id: "users",
  },
  {
    title: "Admin hinzufügen",
    link: "/admin/add-admin",
    id: "add-admin",
  },
  {
    title: "Neue Seite",
    link: "/admin/new-page",
    id: "new-page",
  },
];

/**
 * AdminSideBar is used for both Lehrer and Administrator views.
 *
 * The difference is:
 * - Lehrer: no access to "Benutzer"
 * - Administrator: full admin link set
 */

function AdminSideBar({ showUsers }) {
  const links = showUsers
    ? adminSidebarLinks
    : adminSidebarLinks.filter((l) => l.id !== "users");

  return <SidebarGroup title="Admin" sublinks={links} topLink="/admin" />;
}

function SidebarGroup({ title, sublinks, topLink, collapsible = false }) {
  const pathname = usePathname();
  const isUnderSection =
    pathname === topLink || pathname.startsWith(topLink + "/");
  const [open, setOpen] = useState(isUnderSection);

  if (collapsible) {
    return (
      <div className={styles.sidebarGroup}>
        <button
          type="button"
          className={[
            styles.sidebarLink,
            styles.sidebarGroupToggle,
            isUnderSection ? styles.active : "",
          ].join(" ")}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {title}
          <span
            className={[styles.chevron, open ? styles.chevronOpen : ""].join(
              " "
            )}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
        {open && (
          <div className={styles.sublinkContainer}>
            {sublinks.map((sublink) => (
              <Link
                className={[
                  styles.sublink,
                  pathname === sublink.link ? styles.active : "",
                ].join(" ")}
                key={sublink.link}
                href={sublink.link}
              >
                {sublink.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

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
      <div className={styles.sublinkContainer}>
        {sublinks.map((sublink) => (
          <Link
            className={[
              styles.sublink,
              pathname === sublink.link ? styles.active : "",
            ].join(" ")}
            key={sublink.link}
            href={sublink.link}
          >
            {sublink.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
