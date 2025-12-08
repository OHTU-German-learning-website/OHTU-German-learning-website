import { describe, it, expect, beforeEach } from "vitest";
import { PUT, DELETE } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";

describe("PUT /api/admin/pages/[type]/[slug]", () => {
  useTestDatabase();

  beforeEach(async () => {
    await DB.pool(
      `INSERT INTO html_pages (page_group, slug, title, content, page_order)
        VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)`,
      [
        "resources",
        "test-page",
        "Test Page",
        "<p>Test content</p>",
        1,
        "communications",
        "comm-page",
        "Communication Page",
        "<p>Communication content</p>",
        1,
      ]
    );
  });

  it("should update page slug", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPut, mockParams } = useTestRequest(admin);

    const updateData = {
      slug: "new-slug",
    };

    const response = await PUT(
      mockPut("/api/admin/pages/resources/test-page", updateData),
      mockParams({ type: "resources", slug: "test-page" })
    );

    expect(response.status).toBe(200);
    const result = await DB.pool(
      "SELECT slug FROM html_pages WHERE page_group = $1 AND slug = $2",
      ["resources", "new-slug"]
    );

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].slug).toBe("new-slug");

    const oldResult = await DB.pool(
      "SELECT * FROM html_pages WHERE page_group = $1 AND slug = $2",
      ["resources", "test-page"]
    );

    expect(oldResult.rows.length).toBe(0);
  });

  it("should give an error if slug is already in use", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPut, mockParams } = useTestRequest(admin);

    await DB.pool(
      `INSERT INTO html_pages (page_group, slug, title, content, page_order) VALUES ($1, $2, $3, $4, $5)`,
      ["resources", "existing-slug", "Existing Page", "<p>Content</p>", 2]
    );

    const updateData = {
      slug: "existing-slug",
    };

    const response = await PUT(
      mockPut("/api/admin/pages/resources/test-page", updateData),
      mockParams({ type: "resources", slug: "test-page" })
    );

    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).toContain("already in use");
  });

  it("should return 404 if page does not exist", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPut, mockParams } = useTestRequest(admin);

    const updateData = {
      title: "New Title",
    };

    const response = await PUT(
      mockPut("/api/admin/pages/resources/nonexistent-page", updateData),
      mockParams({ type: "resources", slug: "nonexistent-page" })
    );

    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/admin/pages/[type]/[slug]", () => {
  useTestDatabase();

  beforeEach(async () => {
    await DB.pool(
      `INSERT INTO html_pages (page_group, slug, title, content, page_order)
        VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)`,
      [
        "resources",
        "test-page",
        "Test Page",
        "<p>Test content</p>",
        1,
        "communications",
        "comm-page",
        "Communication Page",
        "<p>Communication content</p>",
        1,
      ]
    );
  });

  it("should delete an existing page", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockDelete, mockParams } = useTestRequest(admin);

    const response = await DELETE(
      mockDelete("/api/admin/pages/resources/test-page"),
      mockParams({ type: "resources", slug: "test-page" })
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.message).toBe("Deleted");
  });

  it("should return 404 if page does not exist", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockDelete, mockParams } = useTestRequest(admin);

    const response = await DELETE(
      mockDelete("/api/admin/pages/resources/nonexistent"),
      mockParams({ type: "resources", slug: "nonexistent" })
    );

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toBe("Not found");
  });
});
