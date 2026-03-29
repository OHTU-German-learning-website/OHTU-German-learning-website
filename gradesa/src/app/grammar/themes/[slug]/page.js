import { Column, Row, Container } from "@/components/ui/layout/container";
import RenderHTML from "@/components/ui/render-html/render-html";
import { getPageData } from "@/backend/html-services";
import AdminButtons from "@/app/pages/[type]/[slug]/admin-buttons";
import { LinkButton } from "@/components/ui/linkbutton";
import { chapters } from "@/app/grammar/alphabetical/chapters";
import { grammarTopics } from "../topics";
import "../lessons.css";

/**  A grammar page slug can have different display labels depending on whether
 * the user arrived from the topics view or the alphabetical view.
 * We prefer the title from the active view, and fall back to the other list. */

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

function getAlphabeticalOrder() {
  return chapters.map((chapter) =>
    decodeURIComponent(chapter.link.split("/").pop())
  );
}

function getTopicsOrder() {
  const seen = new Set();
  const ordered = [];

  for (const topic of grammarTopics) {
    for (const subtopic of topic.subtopics) {
      const slug = decodeURIComponent(subtopic.link.split("/").pop());

      if (!seen.has(slug)) {
        seen.add(slug);
        ordered.push(slug);
      }
    }
  }

  return ordered;
}

/**  Previous/next navigation depends on how the user entered the page:
 * - topics view follows the grouped grammarTopics order
 * - alphabetical view follows chapters order */

function getOrder(view) {
  return view === "alphabetical" ? getAlphabeticalOrder() : getTopicsOrder();
}

export default async function GrammarPage({ params, searchParams }) {
  const { slug } = await params;
  // Some slugs contain URL-encoded characters such as ö.
  // Decode them before matching against local route data and DB content.
  const decodedSlug = decodeURIComponent(slug);

  const resolvedSearchParams = await searchParams;
  const view =
    resolvedSearchParams?.view === "alphabetical" ? "alphabetical" : "topics";

  const order = getOrder(view);
  const currentIndex = order.findIndex((item) => item === decodedSlug);

  const previousSlug = currentIndex > 0 ? order[currentIndex - 1] : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < order.length - 1
      ? order[currentIndex + 1]
      : null;

  const previousLink = previousSlug
    ? `/grammar/themes/${previousSlug}?view=${view}`
    : null;

  const nextLink = nextSlug ? `/grammar/themes/${nextSlug}?view=${view}` : null;

  const chapter = getChapterBySlug(decodedSlug, view);

  try {
    const pageData = await getPageData("grammar", decodedSlug);

    return (
      <Column>
        <AdminButtons type="grammar" slug={decodedSlug} />
        <h1>{pageData.title}</h1>
        <RenderHTML data={pageData.content} />

        <Row pb="xl" justify="space-between">
          {previousLink ? (
            <Container>
              <LinkButton href={previousLink}>Zurück</LinkButton>
            </Container>
          ) : (
            <Container />
          )}

          {nextLink ? (
            <Container>
              <LinkButton href={nextLink}>Weiter</LinkButton>
            </Container>
          ) : (
            <Container />
          )}
        </Row>
      </Column>
    );
  } catch {
    return (
      <Column>
        <AdminButtons type="grammar" slug={decodedSlug} pageExists={false} />
        <h1>{chapter?.title || decodedSlug}</h1>
        <p>Noch kein Inhalt vorhanden.</p>

        <Row pb="xl" justify="space-between">
          {previousLink ? (
            <Container>
              <LinkButton href={previousLink}>Zurück</LinkButton>
            </Container>
          ) : (
            <Container />
          )}

          {nextLink ? (
            <Container>
              <LinkButton href={nextLink}>Weiter</LinkButton>
            </Container>
          ) : (
            <Container />
          )}
        </Row>
      </Column>
    );
  }
}
