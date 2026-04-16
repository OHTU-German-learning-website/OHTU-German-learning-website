import {
  getAlphabeticalGrammarPages,
  getGrammarTopicsWithPages,
  getPageData,
} from "@/backend/html-services";
import EditorSection from "./editor-section";

/** The editor needs the correct fallback title for pages that do not yet exist
 * in the database. The visible title depends on the current grammar view. */

function getChapterBySlug(slug, view, chapters, grammarTopics) {
  if (view === "topics") {
    for (const topic of grammarTopics) {
      const subtopicMatch = topic.subtopics.find(
        (subtopic) => subtopic.slug === slug
      );

      if (subtopicMatch) {
        return {
          title: subtopicMatch.title,
          slug: subtopicMatch.slug,
        };
      }
    }
  }

  const alphabeticalMatch = chapters.find((chapter) => chapter.slug === slug);

  if (alphabeticalMatch) return alphabeticalMatch;

  for (const topic of grammarTopics) {
    const subtopicMatch = topic.subtopics.find(
      (subtopic) => subtopic.slug === slug
    );

    if (subtopicMatch) {
      return {
        title: subtopicMatch.title,
        slug: subtopicMatch.slug,
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
        initialDescription={pageContent.description ?? ""}
        type={type}
        slug={decodedSlug}
        title={pageContent.title}
        page_order={pageContent.page_order}
        pageExists={true}
      />
    );
  } catch {
    if (type === "grammar") {
      const [chapters, grammarTopics] = await Promise.all([
        getAlphabeticalGrammarPages(),
        getGrammarTopicsWithPages(),
      ]);

      const chapter = getChapterBySlug(
        decodedSlug,
        view,
        chapters,
        grammarTopics
      );

      return (
        <EditorSection
          initialContent=""
          initialDescription=""
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
