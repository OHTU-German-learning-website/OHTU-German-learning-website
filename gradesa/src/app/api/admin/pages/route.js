import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { NextResponse } from "next/server";

const VALID_PAGE_GROUPS = new Set(["resources", "communications", "grammar"]);

function normalizePageDescription(description) {
  if (typeof description !== "string") return null;

  const trimmedDescription = description.trim();
  return trimmedDescription ? trimmedDescription : null;
}

function generateBaseSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_+]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(type, title) {
  const baseSlug = generateBaseSlug(title) || "page";

  const existing = await DB.pool(
    "SELECT slug FROM html_pages WHERE page_group = $1 AND (slug = $2 OR slug LIKE $3)",
    [type, baseSlug, `${baseSlug}-%`]
  );

  const used = new Set(existing.rows.map((row) => row.slug));

  if (!used.has(baseSlug)) return baseSlug;

  let suffix = 2;
  while (used.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

async function getNextPageOrder(type) {
  if (type === "grammar") return null;

  const result = await DB.pool(
    "SELECT COALESCE(MAX(page_order), 0) + 1 AS next_order FROM html_pages WHERE page_group = $1",
    [type]
  );

  return result.rows[0]?.next_order ?? 1;
}

async function resolveGrammarTopicId(topicId, newTopicName) {
  if (topicId) {
    const exists = await DB.pool(
      "SELECT id FROM grammar_topics WHERE id = $1",
      [topicId]
    );
    if (exists.rowCount === 0) {
      return null;
    }
    return Number(topicId);
  }

  if (newTopicName) {
    const trimmed = newTopicName.trim();
    if (!trimmed) return null;

    const existingTopic = await DB.pool(
      "SELECT id FROM grammar_topics WHERE LOWER(name) = LOWER($1)",
      [trimmed]
    );
    if (existingTopic.rowCount > 0) {
      return existingTopic.rows[0].id;
    }

    const maxOrder = await DB.pool(
      "SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM grammar_topics"
    );
    const nextOrder = maxOrder.rows[0]?.next_order ?? 1;

    const inserted = await DB.pool(
      "INSERT INTO grammar_topics (name, sort_order) VALUES ($1, $2) RETURNING id",
      [trimmed, nextOrder]
    );
    return inserted.rows[0].id;
  }

  return null;
}

export const POST = withAuth(
  async (req) => {
    const { title, description, type, topicId, newTopicName } =
      await req.json();

    if (!title || !type || !VALID_PAGE_GROUPS.has(type)) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const slug = await generateUniqueSlug(type, trimmedTitle);
    const pageOrder = await getNextPageOrder(type);
    const pageDescription = normalizePageDescription(description);

    let grammarTopicId = null;
    if (type === "grammar") {
      grammarTopicId = await resolveGrammarTopicId(topicId, newTopicName);
    }

    await DB.pool(
      "INSERT INTO html_pages (title, description, content, slug, page_group, page_order, grammar_topic_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [trimmedTitle, pageDescription, "", slug, type, pageOrder, grammarTopicId]
    );

    return NextResponse.json({ slug }, { status: 200 });
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
