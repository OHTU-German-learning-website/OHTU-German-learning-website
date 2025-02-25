"use client";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button/button";
import { Dropdown } from "@/components/ui/dropdown/dropdown";
import { Grid } from "@radix-ui/themes";
import Link from "next/link";
export default function Home() {
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
      </main>
    </div>
  );
}
