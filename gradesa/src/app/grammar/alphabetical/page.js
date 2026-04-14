import Link from "next/link";
import { Column } from "@/components/ui/layout/container";
import { LinkButton } from "@/components/ui/linkbutton";
import { getAlphabeticalGrammarPages } from "@/backend/html-services";

export default async function Chapter() {
  const chapters = await getAlphabeticalGrammarPages();

  return (
    <Column gap="md">
      <LinkButton href="/grammar/themes">Themen der Grammatik</LinkButton>
      <h1>Grammatik in alphabetischer Reihenfolge</h1>

      {chapters.map((chapter) => (
        <Link
          key={chapter.slug}
          href={`/grammar/themes/${encodeURIComponent(chapter.slug)}?view=alphabetical`}
        >
          {chapter.title}
        </Link>
      ))}
    </Column>
  );
}
