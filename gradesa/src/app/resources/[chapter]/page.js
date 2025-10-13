"use client";

import { useState, useEffect } from "react";
import { Column, Container, Row } from "@/components/ui/layout/container";
import "./chapters.css";
import layout from "@/shared/styles/layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { LinkButton } from "@/components/ui/linkbutton";
import { Button } from "@/components/ui/button";
import Editor from "@/components/ui/editor";
import Image from "next/image";
import {
  GlossaryParagraph,
  GlossaryListItem,
} from "@/components/ui/glossary/GlossaryText";
import Anchor from "@/components/ui/anchor/Anchor";
import RenderHTML from "@/app/html-renderer";

export default function Chapters() {
  const { chapter } = useParams();
  const router = useRouter();
  const [editorActive, setEditorActive] = useState(false);
  const [editorContent, setEditorContent] = useState();

  useEffect(() => {
    async function fetchHTML() {
      const res = await fetch(`/api/html-content/${parseInt(chapter)}`);
      const data = await res.json();
      setEditorContent(data);
    }
    fetchHTML();
  }, []);

  const Chapter = chapters.find((c) => c.id === chapter);
  if (!Chapter) {
    router.replace("/resources");
  }

  const previousChapter = chapters.find(
    (c) => parseInt(c.id) === parseInt(chapter) - 1
  );
  const nextChapter = chapters.find(
    (c) => parseInt(c.id) === parseInt(chapter) + 1
  );

  if (editorActive) {
    return (
      <Column className={layout.viewContent}>
        <Button onClick={() => setEditorActive(false)}>Close editor</Button>
        <Row justify="space-between" pb="xl">
          <Editor defaultContent={editorContent.content} />
        </Row>
      </Column>
    );
  }

  return (
    <Column className={layout.viewContent}>
      {Chapter && (
        <>
          <h1>{Chapter.title}</h1>
          <Button onClick={() => setEditorActive(true)}>Open editor</Button>
          <RenderHTML contentId={Chapter.id} />
          {/*<Chapter.content />*/}
        </>
      )}
      <Row justify="space-between" pb="xl">
        {!!previousChapter && (
          <Container mr="auto">
            <LinkButton href={previousChapter.link}>Zurück</LinkButton>
          </Container>
        )}
        {!!nextChapter ? (
          <Container ml="auto">
            <LinkButton href={nextChapter.link}>Weiter</LinkButton>
          </Container>
        ) : (
          <LinkButton href="/learning">Starte den Test</LinkButton>
        )}
      </Row>
    </Column>
  );
}

export const chapters = [
  {
    id: "1",
    linkLabel: "Kapitel 1",
    title: "1. Über das Lernen",
    link: "/resources/1",
  },
  {
    id: "2",
    linkLabel: "Kapitel 2",
    title: "2. Die Arten des Wissens",
    link: "/resources/2",
  },
  {
    id: "3",
    linkLabel: "Kapitel 3",
    title:
      "3. Was sind die Unterschiede zwischen Lernen im Klassenraum und allein lernen?",
    link: "/resources/3",
  },
  {
    id: "4",
    linkLabel: "Kapitel 4",
    title: "4. Was für ein Lerntyp bin ich?",
    link: "/resources/4",
  },
  {
    id: "5",
    linkLabel: "Kapitel 5",
    title: "5.Freiwilliger Selbst-Test zu Lernstrategien",
    link: "/resources/5",
  },
];
