"use client";

import styles from "../page.module.css";
import { LinkButton } from "@/components/ui/linkbutton";
import { Container, Row } from "@/components/ui/layout/container";

export default function grammar() {
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <Container gap="md">
            <Row gap="md">
              <Container bg="var(--bg4)">
                <LinkButton href="/grammar/communications" size="lg">
                  Kommunikationssituationen
                </LinkButton>
                <p>
                  Wähle eien Situation aus, über die du mehr lernen möchtest.{" "}
                  <br />
                  Dort findest du:
                </p>
                <ul>
                  <li>Wortschatz mit Übungen</li>
                  <li>Links zu den Grammatik-Themen, die du dafür brauchst</li>
                </ul>
              </Container>
              <Container bg="var(--bg4)">
                <LinkButton href="/grammar/themes" size="lg">
                  Themen der Grammatik
                </LinkButton>
                <p>
                  Hie findest du die wichtigsten Grammatik-Themen nach Wortarten
                  oder alphabetisch sortiert
                </p>
              </Container>
            </Row>
            <LinkButton href="/grammar/exercises" size="lg">
              Übungen
            </LinkButton>
          </Container>
        </main>
      </div>
    </>
  );
}
