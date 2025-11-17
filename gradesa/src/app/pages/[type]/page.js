import { getPageList } from "@/backend/html-services";
import { Column } from "@/components/ui/layout/container";
import Link from "next/link";

export default async function Chapter({ params }) {
  const { type } = await params;
  const chapters = await getPageList(type);
  let header = "";
  if (type === "resources") header = "Lernen";
  if (type === "communications") header = "Kommunikationssituationen";

  return (
    <Column gap="md">
      <h1>{header}</h1>
      {chapters.map((chapter) => (
        <Link key={chapter.slug} href={`/pages/${type}/${chapter.slug}`}>
          {chapter.title}
        </Link>
      ))}
    </Column>
  );
}
