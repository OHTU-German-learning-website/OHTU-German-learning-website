import { DB } from "@/backend/db";

/**
 * Services for reading and writing HTML page content stored in the database.
 *
 * Pages are grouped by `page_group` (e.g., type/category) and identified by a `slug`.
 * The schema expects columns: `title`, `content`, `page_order`, `slug`, `page_group`.
 */

/**
 * Fetches a single HTML page's data by group and slug.
 *
 * @param {string} type - The `page_group` to filter by.
 * @param {string} slug - The unique slug within the group.
 * @returns {Promise<{title:string, content:string, page_order:number, slug:string, page_group:string}>}
 *   Resolves with the page row when found.
 * @throws {Error} If the page does not exist.
 */
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

/**
 * Updates an HTML page's core fields (`title`, `slug`, `content`).
 *
 * Matching is done by the provided `type` (maps to `page_group`) and the
 * current `slug` value. If the row is found, its fields are updated and the
 * operation returns `true`. If no row matches (e.g., wrong `type` or `slug`),
 * no changes are made and the function returns `false`.
 *
 * Important:
 * - This function can change the `slug`. Subsequent lookups should use the
 *   new slug.
 * - It does not modify `page_order` or `page_group`.
 *
 * @param {string} type - The `page_group` of the page to update.
 * @param {string} slug - The current slug of the page to update.
 * @param {{title:string, slug:string, content:string}} newData - New values to set.
 * @returns {Promise<boolean>} Resolves `true` when exactly one row was updated; otherwise `false`.
 */
export async function setPageData(type, slug, newData) {
  const result = await DB.pool(
    "UPDATE html_pages SET title = $1, slug = $2, content = $3 WHERE page_group = $4 AND slug = $5",
    [newData.title, newData.slug, newData.content, type, slug]
  );
  return result.rowCount == 1;
}

/**
 * Lists pages (title and slug) within a group, ordered by `page_order` ascending.
 *
 * @param {string} type - The `page_group` to list.
 * @returns {Promise<Array<{title:string, slug:string}>>} Resolves with page summaries.
 */
export async function getPageList(type) {
  const result = await DB.pool(
    "SELECT title, slug FROM html_pages WHERE page_group = $1 ORDER BY page_order ASC",
    [type]
  );
  return result.rows;
}
