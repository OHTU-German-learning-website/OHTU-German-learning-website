"use client";
import Image from "next/image";
import styles from "./page.module.css";
import useQuery from "@/shared/hooks/useQuery";
import { useState } from "react";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>home</main>
    </div>
  );
}
