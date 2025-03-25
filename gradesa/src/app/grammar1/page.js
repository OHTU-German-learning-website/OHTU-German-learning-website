"use client";

import Link from "next/link";
import styles from "../page.module.css";
import { Button } from "@/components/ui/button";
import { Grid } from "@radix-ui/themes";
import { Container } from "@/components/ui/layout/container";

export default function grammar1() {
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <Grid columns="2" gap="3" width="auto">
            <Container fontSize="sm" p="xl">
              <Button variant="outline" size="lg" width="fit">
                <Link href="/grammar1/communications">
                  Kommunikationssituationen
                </Link>
              </Button>

              <Button variant="outline" size="lg" width="fit">
                <Link href="/grammar1/lessons">Themen der Grammatik</Link>
              </Button>
            </Container>
          </Grid>
        </main>
      </div>
    </>
  );
}
