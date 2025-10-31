"use client";

import { Column, Container, Row } from "@/components/ui/layout/container";
import "../../../resources/[chapter]/chapters.css";
import layout from "@/shared/styles/layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { LinkButton } from "@/components/ui/linkbutton";
import RenderHTML, { PageType } from "@/app/html-renderer";

export default function Chapters() {
  const { chapter } = useParams();
  const router = useRouter();

  const Chapter = chapters.find((c) => c.id === chapter);
  if (!Chapter) {
    router.replace("grammar/communications");
  }

  const previousChapter = chapters.find(
    (c) => parseInt(c.id) === parseInt(chapter) - 1
  );
  const nextChapter = chapters.find(
    (c) => parseInt(c.id) === parseInt(chapter) + 1
  );

  return (
    <Column className={layout.viewContent}>
      {Chapter && (
        <>
          <h1>{Chapter.title}</h1>
          <p>
            Auf dieser Seite wird die Kommunikationssituation {Chapter.title}{" "}
            erklärt.
          </p>
          <p>Folgende Grammatik-Themen sind damit verbunden: </p>
          <RenderHTML contentId={Chapter.id} type="communications" />
        </>
      )}
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
  {
    id: "9",
    title: "9. Werbung machen",
    link: "/grammar/communications/9",
  },
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
  {
    id: "13",
    title: "13. Pläne machen",
    link: "/grammar/communications/13",
  },
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
