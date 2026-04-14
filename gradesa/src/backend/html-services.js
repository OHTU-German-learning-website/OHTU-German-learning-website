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
  return result.rowCount >= 1;
}

/**
 * Lists pages (title and slug) within a group.
 *
 * Ordering rules:
 * - `grammar`: alphabetical by title
 * - others: page_order ascending, then title as a tiebreaker
 *
 * @param {string} type - The `page_group` to list.
 * @returns {Promise<Array<{title:string, slug:string}>>} Resolves with page summaries.
 */
export async function getPageList(type) {
  const orderByClause =
    type === "grammar"
      ? "ORDER BY LOWER(title) ASC"
      : "ORDER BY page_order ASC NULLS LAST, LOWER(title) ASC";

  const result = await DB.pool(
    `SELECT title, slug FROM html_pages WHERE page_group = $1 ${orderByClause}`,
    [type]
  );
  return result.rows;
}

/**
 * Lists grammar pages grouped under their grammar topics.
 *
 * Topics and pages within each topic are ordered alphabetically by title.
 *
 * @returns {Promise<Array<{id:number,name:string,subtopics:Array<{title:string,slug:string}>}>>}
 */
export async function getGrammarTopicsWithPages() {
  const result = await DB.pool(
    `SELECT
       gt.id,
       gt.name,
       gt.sort_order,
       hp.title,
       hp.slug
     FROM grammar_topics gt
     LEFT JOIN html_pages hp
       ON hp.grammar_topic_id = gt.id
      AND hp.page_group = 'grammar'
     ORDER BY LOWER(gt.name) ASC, LOWER(hp.title) ASC NULLS LAST`
  );

  const topics = [];
  let currentTopic = null;

  for (const row of result.rows) {
    if (!currentTopic || currentTopic.id !== row.id) {
      currentTopic = {
        id: row.id,
        name: row.name,
        subtopics: [],
      };
      topics.push(currentTopic);
    }

    if (row.slug) {
      currentTopic.subtopics.push({
        title: row.title,
        slug: row.slug,
      });
    }
  }

  const uncategorized = await DB.pool(
    `SELECT title, slug
     FROM html_pages
     WHERE page_group = 'grammar'
       AND grammar_topic_id IS NULL
     ORDER BY LOWER(title) ASC`
  );

  if (uncategorized.rowCount > 0) {
    topics.push({
      id: -1,
      name: "Ohne Thema",
      subtopics: uncategorized.rows,
    });
  }

  const legacyTopics = await getLegacyGrammarTopics();
  return mergeGrammarTopics(topics, legacyTopics);
}

/**
 * Lists all grammar pages alphabetically.
 *
 * @returns {Promise<Array<{title:string,slug:string}>>}
 */
export async function getAlphabeticalGrammarPages() {
  const [dbPages, legacyChapters] = await Promise.all([
    getPageList("grammar"),
    getLegacyAlphabeticalChapters(),
  ]);

  const mergedBySlug = new Map();

  for (const chapter of legacyChapters) {
    mergedBySlug.set(chapter.slug, {
      title: chapter.title,
      slug: chapter.slug,
    });
  }

  for (const page of dbPages) {
    mergedBySlug.set(page.slug, {
      title: page.title,
      slug: page.slug,
    });
  }

  return [...mergedBySlug.values()].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );
}

async function getLegacyGrammarTopics() {
  try {
    const module = await import("@/app/grammar/themes/topics");
    const legacyTopics = module?.grammarTopics || [];

    return legacyTopics.map((topic, topicIndex) => ({
      id: -(topicIndex + 1000),
      name: topic.title,
      subtopics: (topic.subtopics || []).map((subtopic) => ({
        title: subtopic.name,
        slug: decodeURIComponent((subtopic.link || "").split("/").pop() || ""),
      })),
    }));
  } catch {
    return [];
  }
}

async function getLegacyAlphabeticalChapters() {
  try {
    const module = await import("@/app/grammar/alphabetical/chapters");
    const chapters = module?.chapters || [];

    return chapters
      .map((chapter) => ({
        title: chapter.title,
        slug: decodeURIComponent((chapter.link || "").split("/").pop() || ""),
      }))
      .filter((chapter) => chapter.slug);
  } catch {
    return [];
  }
}

function mergeGrammarTopics(dbTopics, legacyTopics) {
  const merged = [];
  const byName = new Map();

  const addTopic = (topic) => {
    const key = topic.name.toLowerCase();
    if (!byName.has(key)) {
      const next = {
        id: topic.id,
        name: topic.name,
        subtopics: [],
      };
      byName.set(key, next);
      merged.push(next);
    }

    const target = byName.get(key);
    const seenSlugs = new Set(target.subtopics.map((item) => item.slug));

    for (const subtopic of topic.subtopics || []) {
      if (!subtopic?.slug || seenSlugs.has(subtopic.slug)) continue;
      seenSlugs.add(subtopic.slug);
      target.subtopics.push({
        title: subtopic.title,
        slug: subtopic.slug,
      });
    }

    target.subtopics.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );
  };

  // Merge both sources and then sort alphabetically by topic name.
  for (const topic of legacyTopics) addTopic(topic);
  for (const topic of dbTopics) addTopic(topic);

  return merged.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}
