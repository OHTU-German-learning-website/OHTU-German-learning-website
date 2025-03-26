"use client";

import { useRouter } from "next/navigation";
import { chapters } from "./[chapter]/page";
import Link from "next/link";
import { Column } from "@/components/ui/layout/container";
export default function Chapter() {
  return (
    <Column gap="md">
      <h1>Lernen</h1>
      {chapters.map((chapter) => (
        <Link key={chapter.id} href={chapter.link}>
          {chapter.title}
        </Link>
      ))}
    </Column>
  );
}
