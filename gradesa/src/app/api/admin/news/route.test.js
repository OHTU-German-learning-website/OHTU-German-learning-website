import { beforeEach, describe, expect, it } from "vitest";
import { GET, POST, PUT } from "./route";
import { GET as getPublicNews } from "@/app/api/news/route";
import { DB } from "@/backend/db";
import { useTestDatabase } from "@/backend/test/testdb";
import { TestFactory } from "@/backend/test/testfactory";
import { useTestRequest } from "@/backend/test/mock-request";

describe("/api/admin/news", () => {
  useTestDatabase();

  beforeEach(async () => {
    await DB.pool(
      `INSERT INTO news_articles (title, content, created_at, is_pinned)
       VALUES ('Older pinned', '<p>pinned</p>', '2026-11-01', true),
              ('Newer unpinned', '<p>regular</p>', '2026-11-03', false)`
    );
  });

  it("requires an administrator to update news", async () => {
    const user = await TestFactory.user({ is_admin: false });
    const { mockPost } = useTestRequest(user);

    const response = await POST(
      mockPost("/api/admin/news", {
        title: "Not allowed",
        content: "<p>Not allowed</p>",
        is_pinned: true,
      })
    );

    expect(response.status).toBe(401);
  });

  it("does not allow a teacher to set the pin status", async () => {
    const teacher = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(teacher);

    const response = await POST(
      mockPost("/api/admin/news", {
        title: "Unauthorized pin",
        content: "<p>Not pinned</p>",
        is_pinned: true,
      })
    );

    expect(response.status).toBe(403);
  });

  it("saves a pinned article when a superadmin creates it", async () => {
    const superadmin = await TestFactory.user({
      is_admin: true,
      is_superadmin: true,
    });
    const { mockPost } = useTestRequest(superadmin);

    const response = await POST(
      mockPost("/api/admin/news", {
        title: "Pinned announcement",
        content: "<p>Announcement</p>",
        is_pinned: true,
      })
    );
    const article = await response.json();

    expect(response.status).toBe(201);
    expect(article.is_pinned).toBe(true);

    const stored = await DB.pool(
      "SELECT is_pinned FROM news_articles WHERE id = $1",
      [article.id]
    );
    expect(stored.rows[0].is_pinned).toBe(true);
  });

  it("updates pinning without changing it when omitted", async () => {
    const superadmin = await TestFactory.user({
      is_admin: true,
      is_superadmin: true,
    });
    const { mockPut } = useTestRequest(superadmin);
    const article = await DB.pool(
      "SELECT id FROM news_articles WHERE title = 'Older pinned'"
    );

    const unpinnedResponse = await PUT(
      mockPut("/api/admin/news", {
        id: article.rows[0].id,
        title: "Older pinned",
        content: "<p>pinned</p>",
        is_pinned: false,
      })
    );
    expect((await unpinnedResponse.json()).is_pinned).toBe(false);

    const pinnedResponse = await PUT(
      mockPut("/api/admin/news", {
        id: article.rows[0].id,
        title: "Older pinned",
        content: "<p>pinned</p>",
        is_pinned: true,
      })
    );
    expect((await pinnedResponse.json()).is_pinned).toBe(true);

    const unchangedResponse = await PUT(
      mockPut("/api/admin/news", {
        id: article.rows[0].id,
        title: "Updated without pin field",
        content: "<p>updated</p>",
      })
    );
    expect((await unchangedResponse.json()).is_pinned).toBe(true);
  });

  it("allows teachers to edit news without changing its pin status", async () => {
    const teacher = await TestFactory.user({ is_admin: true });
    const { mockPut } = useTestRequest(teacher);
    const article = await DB.pool(
      "SELECT id FROM news_articles WHERE title = 'Older pinned'"
    );

    const response = await PUT(
      mockPut("/api/admin/news", {
        id: article.rows[0].id,
        title: "Edited by teacher",
        content: "<p>Updated</p>",
      })
    );

    expect(response.status).toBe(200);
    expect((await response.json()).is_pinned).toBe(true);

    const pinResponse = await PUT(
      mockPut("/api/admin/news", {
        id: article.rows[0].id,
        title: "Edited by teacher",
        content: "<p>Updated</p>",
        is_pinned: false,
      })
    );
    expect(pinResponse.status).toBe(403);
  });

  it("orders public news by pinned status before creation date", async () => {
    const response = await getPublicNews();
    const articles = await response.json();

    expect(articles.map(({ title }) => title)).toEqual([
      "Older pinned",
      "Newer unpinned",
    ]);
  });

  it("requires administrator access to the management list", async () => {
    const user = await TestFactory.user({ is_admin: false });
    const { mockGet } = useTestRequest(user);

    const response = await GET(mockGet("/api/admin/news"));
    expect(response.status).toBe(401);
  });
});
