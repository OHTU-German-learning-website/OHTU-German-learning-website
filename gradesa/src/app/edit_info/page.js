"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { Container } from "@/components/ui/layout/container";
import { LinkButton } from "@/components/ui/linkbutton";
import { Grid } from "@radix-ui/themes";

export default function EditInfo() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/edit_info");

      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    };

    getUser();
  }, [router]);

  console.log(user);

  if (!user) {
    return <div className={styles.loader}>Loading...</div>;
  }

  return (
    <Container>
      <h1 className={styles.header}>Deine Profile </h1>

      <h4>Benutzernam: {user.username}</h4>
      <LinkButton href="/edit_info/edit_password">Passwort ändern</LinkButton>
      <h4>Deine Email: {user.email}</h4>
      <LinkButton href="/edit_info/edit_email">
        E-Mail-Adresse ändern
      </LinkButton>

      <Grid columns="2" gap="4"></Grid>
    </Container>
  );
}
