"use client";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import { Grid } from "@radix-ui/themes";
import { Container } from "@/components/ui/layout/container";
import Link from "next/link";
import { useAuth } from "@/context/authContext";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Grid columns="2" gap="3" width="auto">
          <Container fontSize="sm" p="xl">
            <Button variant="outline" size="lg" width="fit">
              <Link href="/learning">Entdecke deine Lernstrategien</Link>
            </Button>
            <Button variant="outline" size="lg" width="fit">
              <Link href="/lessons">Grammatik lernen</Link>
            </Button>
          </Container>
        </Grid>
        {isLoggedIn && (
          <div>
            <p>Sie sind angemeldet</p>
          </div>
        )}
      </main>
    </div>
  );
}
