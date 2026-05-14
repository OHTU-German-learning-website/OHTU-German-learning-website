import { Column, Container } from "@/components/ui/layout/container";
import "./chapters.css";
import layout from "@/shared/styles/layout.module.css";
import RenderHTML from "@/components/ui/render-html/render-html";
import { getPageData } from "@/backend/html-services";
import { transformHtmlToGlossaryTags } from "@/backend/html-transform";
import AdminButtons from "./admin-buttons";

export const dynamic = "force-dynamic";

export default async function Credits() {
  const pageData = await getPageData("system", "impressum");

  // Transform HTML to include glossary tags
  const transformedContent = transformHtmlToGlossaryTags(pageData.content);

  return (
    <Column className={layout.viewContent}>
      <AdminButtons type="system" slug="impressum" />
      <h1 className="chapter-page-title">{pageData.title}</h1>

      <Container className="chapter-rendered-content">
        <RenderHTML data={transformedContent} />
      </Container>
    </Column>
  );
}
