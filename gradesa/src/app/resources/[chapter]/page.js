"use client";

import { useState, useEffect } from "react";
import { Column, Container, Row } from "@/components/ui/layout/container";
import "./chapters.css";
import layout from "@/shared/styles/layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { LinkButton } from "@/components/ui/linkbutton";
import { Button } from "@/components/ui/button";
import Editor from "@/components/ui/editor";
import RenderHTML, { PageType } from "@/app/html-renderer";
import { checkUseIsAdmin } from "@/context/user.context";
import { PAGE_TYPES } from "next/dist/lib/page-types";

export default function Chapters() {
  const { chapter } = useParams();
  const router = useRouter();
  const [editorActive, setEditorActive] = useState(false);
  const [editorContent, setEditorContent] = useState();
  const [editorMessage, setEditorMessage] = useState({ error: false, msg: "" });

  useEffect(() => {
    async function fetchHTML() {
      const res = await fetch(`/api/html-content/${parseInt(chapter)}`);
      const data = await res.json();
      setEditorContent(data.content);
    }
    fetchHTML();
  }, []);

  const submitEditorContent = async () => {
    // A naive approach with string replacement is used here.
    const jsonData = JSON.stringify({
      content: editorContent.replace(/&nbsp;/g, " "),
    });
    const res = await fetch(`/api/html-content/${parseInt(chapter)}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: jsonData,
    });
    if (res.status == 200) {
      setEditorMessage({ error: false, msg: "Updated successfully" });
    } else {
      setEditorMessage({ error: true, msg: res.text() });
    }
    setTimeout(() => setEditorMessage({ error: false, content: "" }), 1000);
  };

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
        <Row gap="1rem">
          <Button onClick={() => setEditorActive(false)}>Close editor</Button>
          <Button onClick={submitEditorContent}>Save changes</Button>
        </Row>
        {!!editorMessage.msg &&
          (editorMessage.error ? (
            <p className="error-message">{editorMessage.msg}</p>
          ) : (
            <p className="success-message">{editorMessage.msg}</p>
          ))}
        <Row justify="space-between" pb="xl">
          <Editor
            defaultContent={editorContent}
            updateEditorContent={(content) => setEditorContent(content)}
          />
        </Row>
      </Column>
    );
  }

  return (
    <Column className={layout.viewContent}>
      {Chapter && (
        <>
          <h1>{Chapter.title}</h1>
          {checkUseIsAdmin() == true && (
            <Button onClick={() => setEditorActive(true)}>Open editor</Button>
          )}
          <RenderHTML contentId={Chapter.id} type="resources" />
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
