"use client";

import styles from "../page.module.css";
import { LinkButton } from "@/components/ui/linkbutton";
import { Grid } from "@radix-ui/themes";
import { Container } from "@/components/ui/layout/container";

export default function grammar() {
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <Grid columns="2" gap="3" width="auto">
            <Container fontSize="sm" p="xl">
              <LinkButton href="/grammar/communications" size="lg">
                Kommunikationssituationen
              </LinkButton>
              <LinkButton href="/grammar/themes" size="lg">
                Themen der Grammatik
              </LinkButton>
              <LinkButton href="/grammar/exercises" size="lg">
                Übungen
              </LinkButton>
            </Container>
          </Grid>
        </main>
      </div>
    </>
  );
}
