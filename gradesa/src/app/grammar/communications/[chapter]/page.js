"use client";

import { Column, Container, Row } from "@/components/ui/layout/container";
import "../../../resources/[chapter]/chapters.css";
import layout from "@/shared/styles/layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { LinkButton } from "@/components/ui/linkbutton";
import { chapters } from "./chapters";

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
          <Chapter.content />
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
