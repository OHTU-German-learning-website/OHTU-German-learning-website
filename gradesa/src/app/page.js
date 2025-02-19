"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button/button";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Button>Default</Button>
        <Button variant="primary" size="sm">
          Primary
        </Button>
        <Button variant="secondary" size="md" width="fit">
          Secondary
        </Button>
        <Button variant="tertiary" size="lg" width="full">
          Tertiary
        </Button>
        <Button variant="none" size="xl">
          None
        </Button>
        <Button variant="outline" size="sm" width="fit">
          Outline
        </Button>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </main>
    </div>
  );
}
