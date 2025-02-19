"use client";
import Image from "next/image";
import styles from "./page.module.css";
import useQuery from "@/shared/hooks/useQuery";
import { useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Dropdown } from "@/components/ui/dropdown/dropdown";
import { Grid } from "@radix-ui/themes";
import Link from "next/link";
export default function Home() {
  const [mode, setMode] = useState("normal");

  const { data, error, isLoading } = useQuery("/hello", { mode });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Grid columns={{ initial: "1", md: "2" }} gap="3" width="auto">
          <Button variant="outline" size="lg" width="fit">
            <Link href="#">How You Learn</Link>
          </Button>
          <Button variant="outline" size="lg" width="fit">
            <Link href="/lessons">Learn Grammar</Link>
          </Button>
        </Grid>
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
        <Dropdown
          options={[
            {
              label: "Option 1",
              value: "option1",
            },
            {
              label: "Option 2",
              value: "option2",
            },
            {
              label: "Option 3",
              value: "option3",
              disabled: true,
            },
          ]}
        >
          <Button>Dropdown</Button>
        </Dropdown>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.js</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>
        {data && <p>{data.message}</p>}
        DB TIME: {isLoading ? <p>Loading...</p> : data && <p>{data.now}</p>}
        ERROR: {error ? <p>{error}</p> : <p>No error</p>}
        <button onClick={() => setMode("error")}>Error</button>
        <button onClick={() => setMode("normal")}>Normal</button>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
