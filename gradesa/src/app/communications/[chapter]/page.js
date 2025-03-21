"use client";

import { Column, Container, Row } from "@/components/ui/layout/container";
import Link from "next/link";
import "../../resources/[chapter]/chapters.css";
import layout from "@/shared/styles/layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Chapters() {
  const { chapter } = useParams();
  const router = useRouter();

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

  return (
    <Column className={layout.viewContent}>
      {Chapter && (
        <>
          <h1>{Chapter.title}</h1>
          <Chapter.content />
        </>
      )}
      <Row justify="space-between" pb="xl">
        {!!previousChapter && (
          <Container mr="auto">
            <Link href={previousChapter.link}>
              <Button>Zurück</Button>
            </Link>
          </Container>
        )}
        {!!nextChapter ? (
          <Container ml="auto">
            <Link href={nextChapter.link}>
              <Button>Weiter</Button>
            </Link>
          </Container>
        ) : (
          <Link href="/learning">
            <Button>Starte den Test</Button>
          </Link>
        )}
      </Row>
    </Column>
  );
}

export const chapters = [
  {
    id: "1",
    title: "1. Über das Lernen",
    content: Chapter1,
    link: "/resources/1",
  },
  {
    id: "2",
    title: "2. Die Arten des Wissens",
    content: Chapter2,
    link: "/resources/2",
  },
  {
    id: "3",
    title:
      "3. Was sind die Unterschiede zwischen Lernen im Klassenraum und allein lernen?",
    content: Chapter3,
    link: "/resources/3",
  },
  {
    id: "4",
    title: "4. Was für ein Lerntyp bin ich?",
    content: Chapter4,
    link: "/resources/4",
  },
  {
    id: "5",
    title: "5.Freiwilliger Selbst-Test zu Lernstrategien",
    content: Chapter5,
    link: "/resources/5",
  },
];

function Chapter1() {
  return (
    <Column className="chapter-content">
      <p>
        Hier findest du einen Fragebogen, der von Fremdsprach-Didaktikern
        entwickelt wurde. Den kannst du auf Deutsch oder Englisch ausfüllen. Er
        soll dir zeigen, welche Lernstrategien du oP und gern verwendest. Dazu
        rechnet der Computer die DurchschniOswerte der einzelnen Teile aus. Je
        höher der Wert ist, desto mehr bevorzugst du Lernstrategien dieser
        Bereiche. Dann kannst du für dich geeignete Übungen auswählen.
      </p>
    </Column>
  );
}

function Chapter2() {
  return (
    <Column className="chapter-content">
      <p>
        Hier findest du einen Fragebogen, der von Fremdsprach-Didaktikern
        entwickelt wurde. Den kannst du auf Deutsch oder Englisch ausfüllen. Er
        soll dir zeigen, welche Lernstrategien du oP und gern verwendest. Dazu
        rechnet der Computer die DurchschniOswerte der einzelnen Teile aus. Je
        höher der Wert ist, desto mehr bevorzugst du Lernstrategien dieser
        Bereiche. Dann kannst du für dich geeignete Übungen auswählen.
      </p>
    </Column>
  );
}

function Chapter3() {
  return (
    <Column className="chapter-content">
      <p>
        Hier findest du einen Fragebogen, der von Fremdsprach-Didaktikern
        entwickelt wurde. Den kannst du auf Deutsch oder Englisch ausfüllen. Er
        soll dir zeigen, welche Lernstrategien du oP und gern verwendest. Dazu
        rechnet der Computer die DurchschniOswerte der einzelnen Teile aus. Je
        höher der Wert ist, desto mehr bevorzugst du Lernstrategien dieser
        Bereiche. Dann kannst du für dich geeignete Übungen auswählen.
      </p>
    </Column>
  );
}

function Chapter4() {
  return (
    <Column className="chapter-content">
      <p>
        Hier findest du einen Fragebogen, der von Fremdsprach-Didaktikern
        entwickelt wurde. Den kannst du auf Deutsch oder Englisch ausfüllen. Er
        soll dir zeigen, welche Lernstrategien du oP und gern verwendest. Dazu
        rechnet der Computer die DurchschniOswerte der einzelnen Teile aus. Je
        höher der Wert ist, desto mehr bevorzugst du Lernstrategien dieser
        Bereiche. Dann kannst du für dich geeignete Übungen auswählen.
      </p>
    </Column>
  );
}
function Chapter5() {
  return (
    <Column className="chapter-content">
      <p>
        Hier findest du einen Fragebogen, der von Fremdsprach-Didaktikern
        entwickelt wurde. Den kannst du auf Deutsch oder Englisch ausfüllen. Er
        soll dir zeigen, welche Lernstrategien du oP und gern verwendest. Dazu
        rechnet der Computer die DurchschniOswerte der einzelnen Teile aus. Je
        höher der Wert ist, desto mehr bevorzugst du Lernstrategien dieser
        Bereiche. Dann kannst du für dich geeignete Übungen auswählen.
      </p>
    </Column>
  );
}
