import { getPageData } from "@/backend/html-services";
import EditorSection from "./editor-section";

export default async function Edit({ params }) {
  const { type, slug } = await params;
  const pageContent = await getPageData(type, slug);
  return (
    <EditorSection
      initialContent={pageContent.content}
      type={type}
      slug={slug}
      title={pageContent.title}
      page_order={pageContent.page_order}
    />
  );
}
