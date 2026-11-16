import { DB } from "@/backend/db";
import { saveBackup } from "@/backend/backups";
import { withAuth } from "@/backend/middleware/withAuth";
import { NextResponse } from "next/server";

async function getNews(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch single article by ID
      const result = await DB.pool(
        `SELECT na.id,
                na.title,
                na.content,
                na.created_at,
                na.updated_at,
                na.created_by AS created_by_id,
                na.updated_by AS updated_by_id,
                COALESCE(NULLIF(cu.username, ''), cu.email) AS created_by,
                COALESCE(NULLIF(uu.username, ''), uu.email) AS updated_by,
                na.is_teacher_only,
                na.is_pinned
         FROM news_articles na
         LEFT JOIN users cu ON cu.id = na.created_by
         LEFT JOIN users uu ON uu.id = na.updated_by
         WHERE na.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "News article not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    }

    // Fetch all articles
    const articles = await DB.pool(
      `SELECT na.id,
            na.title,
            na.content,
            na.created_at,
            na.updated_at,
            na.created_by AS created_by_id,
            na.updated_by AS updated_by_id,
            COALESCE(NULLIF(cu.username, ''), cu.email) AS created_by,
            COALESCE(NULLIF(uu.username, ''), uu.email) AS updated_by,
            na.is_teacher_only,
            na.is_pinned
       FROM news_articles na
       LEFT JOIN users cu ON cu.id = na.created_by
       LEFT JOIN users uu ON uu.id = na.updated_by
       ORDER BY na.is_pinned DESC, na.created_at DESC`
    );

    return NextResponse.json(articles.rows);
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch news articles" },
      { status: 500 }
    );
  }
}

async function createNews(request) {
  try {
    const { title, content, is_teacher_only, is_pinned } = await request.json();

    if (is_pinned !== undefined && request.user?.is_superadmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    if (
      (is_teacher_only !== undefined && typeof is_teacher_only !== "boolean") ||
      (is_pinned !== undefined && typeof is_pinned !== "boolean")
    ) {
      return NextResponse.json(
        { error: "News visibility options must be boolean" },
        { status: 400 }
      );
    }

    const result = await DB.pool(
      `INSERT INTO news_articles (title, content, is_teacher_only, is_pinned)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, content, created_at, updated_at, is_teacher_only, is_pinned`,
      [title, content, is_teacher_only ?? false, is_pinned ?? false]
    );

    // Save a backup snapshot
    try {
      await saveBackup(
        "news_articles",
        result.rows[0].id,
        result.rows[0],
        null
      );
    } catch (err) {
      console.error("Backup save error:", err);
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating news article:", error);
    return NextResponse.json(
      { error: "Failed to create news article" },
      { status: 500 }
    );
  }
}

async function updateNews(request) {
  try {
    const { id, title, content, is_teacher_only, is_pinned } =
      await request.json();

    if (is_pinned !== undefined && request.user?.is_superadmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "ID, title, and content are required" },
        { status: 400 }
      );
    }

    if (
      (is_teacher_only !== undefined && typeof is_teacher_only !== "boolean") ||
      (is_pinned !== undefined && typeof is_pinned !== "boolean")
    ) {
      return NextResponse.json(
        { error: "News visibility options must be boolean" },
        { status: 400 }
      );
    }

    const result = await DB.pool(
      `UPDATE news_articles 
       SET title = $1,
           content = $2,
           is_teacher_only = COALESCE($4, is_teacher_only),
           is_pinned = COALESCE($5, is_pinned),
           updated_at = now()
       WHERE id = $3
       RETURNING id, title, content, created_at, updated_at, is_teacher_only, is_pinned`,
      [title, content, id, is_teacher_only ?? null, is_pinned ?? null]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    // Save a backup snapshot of the updated row (non-blocking)
    try {
      saveBackup("news_articles", id, result.rows[0], null);
    } catch (err) {
      console.error("Backup save error:", err);
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating news article:", error);
    return NextResponse.json(
      { error: "Failed to update news article" },
      { status: 500 }
    );
  }
}

async function deleteNews(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await DB.pool(`DELETE FROM news_articles WHERE id = $1`, [
      id,
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "News article deleted successfully" });
  } catch (error) {
    console.error("Error deleting news article:", error);
    return NextResponse.json(
      { error: "Failed to delete news article" },
      { status: 500 }
    );
  }
}

const adminOnly = { requireAuth: true, requireAdmin: true };

export const GET = withAuth(getNews, adminOnly);
export const POST = withAuth(createNews, adminOnly);
export const PUT = withAuth(updateNews, adminOnly);
export const DELETE = withAuth(deleteNews, adminOnly);
