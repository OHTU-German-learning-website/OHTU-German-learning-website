import { Column, Container, Row } from "@/components/ui/layout/container";
import "./chapters.css";
import layout from "@/shared/styles/layout.module.css";
import RenderHTML from "@/components/ui/render-html/render-html";
import { getPageData, getPageList } from "@/backend/html-services";
import { transformHtmlToGlossaryTags } from "@/backend/html-transform";
import EditButton from "./edit-button";
import { LinkButton } from "@/components/ui/linkbutton";

export default async function Chapters({ params }) {
  const { type, slug } = await params;
  const pageData = await getPageData(type, slug);

  // Transform HTML to include glossary tags
  const transformedContent = transformHtmlToGlossaryTags(pageData.content);

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
      <EditButton url={`/admin/edit-page/${type}/${slug}`} />
      <h1>{pageData.title}</h1>
      <RenderHTML data={transformedContent} />
      <Row pb="xl" justify="space-between">
        {previousLink && (
          <Container>
            <LinkButton href={previousLink}>Zurück</LinkButton>
          </Container>
        )}
        {nextLink && (
          <Container>
            <LinkButton href={nextLink}>Weiter</LinkButton>
          </Container>
        )}
      </Row>
    </Column>
  );
}
