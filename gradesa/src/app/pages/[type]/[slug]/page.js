import { Column, Container, Row } from "@/components/ui/layout/container";
import "./chapters.css";
import layout from "@/shared/styles/layout.module.css";
import RenderHTML from "@/components/ui/render-html/render-html";
import { getPageData, getPageList } from "@/backend/html-services";
import { transformHtmlToGlossaryTags } from "@/backend/html-transform";
import AdminButtons from "./admin-buttons";
import { LinkButton } from "@/components/ui/linkbutton";

export default async function Chapters({ params }) {
  const { type, slug } = await params;
  const pageData = await getPageData(type, slug);

  // Transform HTML to include glossary tags
  const transformedContent = transformHtmlToGlossaryTags(pageData.content);
  const showLearningFormLink = type === "resources" && slug === "5"; // Hotfix for showing learning form link.
  // Notice that if you edit the slug or type, you need to adjust them here. Otherwise the button doesn't show.

  const pageList = await getPageList(type);
  const currentIndex = pageList.findIndex((e) => e.slug === slug);
  let previousLink;
  let nextLink;
  if (currentIndex !== 0) {
    previousLink = `/pages/${type}/${pageList[currentIndex - 1].slug}`;
  }
  if (currentIndex < pageList.length - 1) {
    nextLink = `/pages/${type}/${pageList[currentIndex + 1].slug}`;
  }

  return (
    <Column className={layout.viewContent}>
      <AdminButtons type={type} slug={slug} />
      <h1>{pageData.title}</h1>

      <Container className="chapter-rendered-content">
        <RenderHTML data={transformedContent} />
      </Container>

      <Row pb="xl" className="chapter-nav-row" justify="space-between">
        <Container className="chapter-nav-left">
          {previousLink && <LinkButton href={previousLink}>Zurück</LinkButton>}
        </Container>
        <Container className="chapter-nav-right">
          {showLearningFormLink && (
            <LinkButton href="/learning">Go to form</LinkButton>
          )}
          {nextLink && <LinkButton href={nextLink}>Weiter</LinkButton>}
        </Container>
      </Row>
    </Column>
  );
}
