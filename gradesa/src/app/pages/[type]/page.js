import { getPageList } from "@/backend/html-services";
import { Column } from "@/components/ui/layout/container";
import Link from "next/link";
import styles from "./overview.module.css";

export default async function Chapter({ params }) {
  const { type } = await params;
  const chapters = await getPageList(type);
  let header = "";
  if (type === "resources") header = "Lernen";
  if (type === "communications") header = "Kommunikationssituationen";

  return (
    <Column gap="md">
      <h1>{header}</h1>
      {type === "communications" ? (
        <div className={styles.cards}>
          {chapters.map((chapter) => (
            <article className={styles.card} key={chapter.slug}>
              <Link
                className={styles.cardTitle}
                href={`/pages/${type}/${chapter.slug}`}
              >
                {chapter.title}
              </Link>
              {chapter.description && (
                <p className={styles.cardDescription}>{chapter.description}</p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.linkList}>
          {chapters.map((chapter) => (
            <Link key={chapter.slug} href={`/pages/${type}/${chapter.slug}`}>
              {chapter.title}
            </Link>
          ))}
        </div>
      )}
    </Column>
  );
}
