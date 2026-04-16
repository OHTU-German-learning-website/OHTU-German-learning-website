import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";

describe("POST /api/admin/pages", () => {
  useTestDatabase();

  beforeEach(async () => {
    await DB.pool(
      `INSERT INTO grammar_topics (name, sort_order) VALUES ($1, $2), ($3, $4)`,
      ["Verb", 1, "Syntax", 2]
    );

    await DB.pool(
      `INSERT INTO html_pages (page_group, slug, title, content, page_order)
       VALUES ($1, $2, $3, $4, $5)`,
      ["resources", "welcome", "Welcome", "", 1]
    );
  });

  it("creates a resources page and increments page_order", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const before = await DB.pool(
      `SELECT COALESCE(MAX(page_order), 0) AS max_order
       FROM html_pages
       WHERE page_group = 'resources'`
    );
    const expectedNextOrder = Number(before.rows[0].max_order) + 1;

    const response = await POST(
      mockPost("/api/admin/pages", {
        description: "Resource summary",
        title: "New Resource",
        type: "resources",
      })
    );

    expect(response.status).toBe(200);

    const inserted = await DB.pool(
      `SELECT slug, title, description, page_order, grammar_topic_id
       FROM html_pages
       WHERE page_group = 'resources' AND slug = 'new-resource'`
    );

    expect(inserted.rowCount).toBe(1);
    expect(inserted.rows[0].title).toBe("New Resource");
    expect(inserted.rows[0].description).toBe("Resource summary");
    expect(inserted.rows[0].page_order).toBe(expectedNextOrder);
    expect(inserted.rows[0].grammar_topic_id).toBeNull();
  });

  it("creates a grammar page without topic when none is selected", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("/api/admin/pages", {
        title: "Untopicked Grammar",
        type: "grammar",
      })
    );

    expect(response.status).toBe(200);

    const inserted = await DB.pool(
      `SELECT slug, page_order, grammar_topic_id
       FROM html_pages
       WHERE page_group = 'grammar' AND slug = 'untopicked-grammar'`
    );

    expect(inserted.rowCount).toBe(1);
    expect(inserted.rows[0].page_order).toBeNull();
    expect(inserted.rows[0].grammar_topic_id).toBeNull();
  });

  it("creates a grammar page with existing topicId", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const topic = await DB.pool(
      "SELECT id FROM grammar_topics WHERE name = 'Syntax'"
    );

    const response = await POST(
      mockPost("/api/admin/pages", {
        title: "Syntax Kapitel",
        type: "grammar",
        topicId: topic.rows[0].id,
      })
    );

    expect(response.status).toBe(200);

    const inserted = await DB.pool(
      `SELECT grammar_topic_id
       FROM html_pages
       WHERE page_group = 'grammar' AND slug = 'syntax-kapitel'`
    );

    expect(inserted.rowCount).toBe(1);
    expect(inserted.rows[0].grammar_topic_id).toBe(topic.rows[0].id);
  });

  it("creates and reuses topic by case-insensitive name", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const first = await POST(
      mockPost("/api/admin/pages", {
        title: "Verb Kapitel 1",
        type: "grammar",
        newTopicName: "Neue Kategorie",
      })
    );

    expect(first.status).toBe(200);

    const second = await POST(
      mockPost("/api/admin/pages", {
        title: "Verb Kapitel 2",
        type: "grammar",
        newTopicName: "neue kategorie",
      })
    );

    expect(second.status).toBe(200);

    const topics = await DB.pool(
      `SELECT id FROM grammar_topics WHERE LOWER(name) = LOWER($1)`,
      ["Neue Kategorie"]
    );

    expect(topics.rowCount).toBe(1);

    const pages = await DB.pool(
      `SELECT grammar_topic_id FROM html_pages WHERE slug IN ('verb-kapitel-1', 'verb-kapitel-2') ORDER BY slug ASC`
    );

    expect(pages.rowCount).toBe(2);
    expect(pages.rows[0].grammar_topic_id).toBe(topics.rows[0].id);
    expect(pages.rows[1].grammar_topic_id).toBe(topics.rows[0].id);
  });

  it("returns 400 for invalid payload", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("/api/admin/pages", {
        title: "",
        type: "grammar",
      })
    );

    expect(response.status).toBe(400);
  });
});
