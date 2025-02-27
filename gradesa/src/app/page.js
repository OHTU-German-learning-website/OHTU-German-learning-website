"use client";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import { Grid } from "@radix-ui/themes";
import Link from "next/link";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Grid columns="2" gap="3" width="auto">
          <Button variant="outline" size="lg" width="fit">
            <Link href="/learning">Entdecke deine Lernstrategien</Link>
          </Button>
          <Button variant="outline" size="lg" width="fit">
            <Link href="/lessons">Grammatik lernen</Link>
          </Button>
        </Grid>
      </main>
    </div>
  );
}
