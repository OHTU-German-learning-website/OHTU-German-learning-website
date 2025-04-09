"use client";

import Link from "next/link";
import { Column } from "@/components/ui/layout/container";
import { LinkButton } from "@/components/ui/linkbutton";
import { chapters } from "@/app/grammar/alphabetical/chapters";

export default function Chapter() {
  return (
    <Column gap="md">
      <LinkButton href="/grammar/themes">Themen der Grammatik</LinkButton>
      <h1>Grammatik in alphabetischer Reihenfolge</h1>

      {chapters.map((chapter) => (
        <Link key={chapter.id} href={chapter.link}>
          {chapter.title}
        </Link>
      ))}
    </Column>
  );
}
