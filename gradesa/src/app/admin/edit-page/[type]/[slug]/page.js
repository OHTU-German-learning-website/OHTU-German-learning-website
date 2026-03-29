import { getPageData } from "@/backend/html-services";
import EditorSection from "./editor-section";
import { chapters } from "@/app/grammar/alphabetical/chapters";
import { grammarTopics } from "@/app/grammar/themes/topics";

/** The editor needs the correct fallback title for pages that do not yet exist
 * in the database. The visible title depends on the current grammar view. */

function getChapterBySlug(slug, view) {
  if (view === "topics") {
    for (const topic of grammarTopics) {
      const subtopicMatch = topic.subtopics.find((subtopic) =>
        subtopic.link.endsWith(`/${slug}`)
      );

      if (subtopicMatch) {
        return {
          title: subtopicMatch.name,
          link: subtopicMatch.link,
        };
      }
    }
  }

  const alphabeticalMatch = chapters.find((chapter) =>
    chapter.link.endsWith(`/${slug}`)
  );

  if (alphabeticalMatch) return alphabeticalMatch;

  for (const topic of grammarTopics) {
    const subtopicMatch = topic.subtopics.find((subtopic) =>
      subtopic.link.endsWith(`/${slug}`)
    );

    if (subtopicMatch) {
      return {
        title: subtopicMatch.name,
        link: subtopicMatch.link,
      };
    }
  }

  return null;
}

export default async function Edit({ params, searchParams }) {
  const { type, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const resolvedSearchParams = await searchParams;
  /**  Preserve the originating grammar view so the editor uses the same label
   *  conventions as the page the user came from. */
  const view =
    resolvedSearchParams?.view === "alphabetical" ? "alphabetical" : "topics";

  try {
    const pageContent = await getPageData(type, decodedSlug);

    return (
      <EditorSection
        initialContent={pageContent.content}
        type={type}
        slug={decodedSlug}
        title={pageContent.title}
        page_order={pageContent.page_order}
        pageExists={true}
      />
    );
  } catch {
    if (type === "grammar") {
      const chapter = getChapterBySlug(decodedSlug, view);

      return (
        <EditorSection
          initialContent=""
          type={type}
          slug={decodedSlug}
          title={chapter?.title || decodedSlug}
          page_order={null}
          pageExists={false}
        />
      );
    }

    throw new Error("Page not found");
  }
}
