import { DB } from "@/backend/db";

export async function getPageData(type, slug) {
  const result = await DB.pool(
    "SELECT title, content, page_order, slug, page_group FROM html_pages WHERE page_group = $1 AND slug = $2",
    [type, slug]
  );

  if (result.rowCount === 0) {
    throw new Error("HTML page not found");
  }
  return result.rows[0];
}

export async function setPageData(type, slug, newData) {
  const result = await DB.pool(
    "UPDATE html_pages SET title = $1, slug = $2, content = $3 WHERE page_group = $4 AND slug = $5",
    [newData.title, newData.slug, newData.content, type, slug]
  );
  return result.rowCount == 1;
}

export async function getPageList(type) {
  const result = await DB.pool(
    "SELECT title, slug FROM html_pages WHERE page_group = $1 ORDER BY page_order ASC",
    [type]
  );
  return result.rows;
}
