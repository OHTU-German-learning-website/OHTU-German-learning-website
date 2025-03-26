"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Column } from "@/components/ui/layout/container";

export const chapters = [
  {
    id: "1",
    title: "Artikel",
    link: "/grammar/lessons", //this is supposed to link to the grammar article page
  },
];

export default function Chapter() {
  return (
    <Column gap="md">
      <h1>Themen der Grammatik</h1>
      <Link href="/grammar/lessons">Lessons page</Link>
      {chapters.map((chapter) => (
        <Link key={chapter.id} href={chapter.link}>
          {chapter.title}
        </Link>
      ))}
    </Column>
  );
}
