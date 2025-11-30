"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Column, Container, Row } from "@/components/ui/layout/container";
import { LinkButton } from "@/components/ui/linkbutton";
import RenderHTML from "@/app/html-renderer"; // Old renderer for static pages
import layout from "@/shared/styles/layout.module.css"; // Keep original styles
import "../../../resources/[chapter]/chapters.css"; // Keep original styles

// 1.STATIC LIST (Do not change)
export const chapters = [
  {
    id: "1",
    title: "1. Über Vergangenes sprechen",
    link: "/grammar/communications/1",
  },
  {
    id: "2",
    title: "2. Anleitungen formulieren",
    link: "/grammar/communications/2",
  },
  {
    id: "3",
    title: "3. Offizielle Mitteilungen (Nachrichten usw.) formulieren",
    link: "/grammar/communications/3",
  },
  {
    id: "4",
    title:
      "4. Höflich mit anderen Menschen umgehen (Sich vorstellen, Gäste empfangen und betreuen, Small Talk)",
    link: "/grammar/communications/4",
  },
  {
    id: "5",
    title: "5. Menschen beschreiben / Ich und meine Familie",
    link: "/grammar/communications/5",
  },
  {
    id: "6",
    title: "6. Über Hobbys und Freizeit sprechen",
    link: "/grammar/communications/6",
  },
  {
    id: "7",
    title: "7. Über Beruf und Arbeitsplatz sprechen",
    link: "/grammar/communications/7",
  },
  {
    id: "8",
    title: "8. Firmen und Produkte beschreiben",
    link: "/grammar/communications/8",
  },
  { id: "9", title: "9. Werbung machen", link: "/grammar/communications/9" },
  {
    id: "10",
    title: "10. Einkaufen privat und geschäftlich",
    link: "/grammar/communications/10",
  },
  {
    id: "11",
    title: "11. Räume beschreiben",
    link: "/grammar/communications/11",
  },
  {
    id: "12",
    title: "12. Über historische Ereignisse sprechen",
    link: "/grammar/communications/12",
  },
  { id: "13", title: "13. Pläne machen", link: "/grammar/communications/13" },
  {
    id: "14",
    title:
      "14. an Versammlungen und Geschäftstreffen teilnehmen und sie leiten",
    link: "/grammar/communications/14",
  },
  {
    id: "15",
    title: "15. Jemandem gratulieren",
    link: "/grammar/communications/15",
  },
  {
    id: "16",
    title: "16. Sich beschweren / etw. reklamieren",
    link: "/grammar/communications/16",
  },
];

export default function Chapters() {
  const { chapter: chapterSlug } = useParams(); // Get the URL part
  const router = useRouter();

  // A. Check if it is a STATIC page
  const staticChapter = chapters.find((c) => c.id === chapterSlug);

  // State for DYNAMIC pages (Your new database content)
  const [dbPage, setDbPage] = useState(null);
  const [loading, setLoading] = useState(!staticChapter); // Only load if not static
  const [error, setError] = useState(false);

  // B. If not static, try to fetch from Database API
  useEffect(() => {
    if (staticChapter) return; // If we found it in the list, stop here.

    async function fetchPage() {
      try {
        // Call the new API we created earlier
        const res = await fetch(`/api/content-by-slug?slug=${chapterSlug}`);

        if (res.ok) {
          const data = await res.json();
          setDbPage(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [chapterSlug, staticChapter]);

  // --- RENDER LOGIC ---

  // 1. RENDER STATIC PAGE (The Original Design)
  if (staticChapter) {
    const previousChapter = chapters.find(
      (c) => parseInt(c.id) === parseInt(chapterSlug) - 1
    );
    const nextChapter = chapters.find(
      (c) => parseInt(c.id) === parseInt(chapterSlug) + 1
    );

    return (
      <Column className={layout.viewContent}>
        <h1>{staticChapter.title}</h1>
        <p>
          Auf dieser Seite wird die Kommunikationssituation{" "}
          {staticChapter.title} erklärt.
        </p>
        <p>Folgende Grammatik-Themen sind damit verbunden: </p>

        {/* Use the old renderer */}
        <RenderHTML contentId={staticChapter.id} type="communications" />

        <Row justify="space-between" pb="xl">
          {!!previousChapter && (
            <Container mr="auto">
              <LinkButton href={previousChapter.link}>Zurück</LinkButton>
            </Container>
          )}
          {!!nextChapter && (
            <Container ml="auto">
              <LinkButton href={nextChapter.link}>Weiter</LinkButton>
            </Container>
          )}
        </Row>
      </Column>
    );
  }

  // 2. LOADING STATE
  if (loading) return <div style={{ padding: "2rem" }}>Laden...</div>;

  // 3. ERROR STATE (404)
  if (error || !dbPage) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>404 - Seite nicht gefunden</h1>
        <LinkButton href="/grammar/communications">Zurück</LinkButton>
      </div>
    );
  }

  // 4. RENDER NEW DATABASE PAGE
  return (
    <Column className={layout.viewContent}>
      <h1>{dbPage.title}</h1>

      {/* Inject the HTML content from the editor */}
      <div
        className="ql-editor" // Apply Quill styles so it looks nice
        style={{ padding: 0 }}
        dangerouslySetInnerHTML={{ __html: dbPage.content }}
      />

      <div style={{ marginTop: "2rem" }}>
        <LinkButton href="/grammar/communications">Zurück</LinkButton>
      </div>
    </Column>
  );
}
