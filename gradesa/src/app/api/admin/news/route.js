import { DB } from "@/backend/db";
import { NextResponse } from "next/server";

export async function GET(request) {
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
                na.is_teacher_only
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
            na.is_teacher_only
       FROM news_articles na
       LEFT JOIN users cu ON cu.id = na.created_by
       LEFT JOIN users uu ON uu.id = na.updated_by
       ORDER BY na.created_at DESC`
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

export async function POST(request) {
  try {
    const { title, content, is_teacher_only } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const result = await DB.pool(
      `INSERT INTO news_articles (title, content, is_teacher_only) 
       VALUES ($1, $2, $3) 
       RETURNING id, title, content, created_at, updated_at, is_teacher_only`,
      [title, content, is_teacher_only || false]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating news article:", error);
    return NextResponse.json(
      { error: "Failed to create news article" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, title, content, is_teacher_only } = await request.json();

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "ID, title, and content are required" },
        { status: 400 }
      );
    }

    const result = await DB.pool(
      `UPDATE news_articles 
       SET title = $1, content = $2, is_teacher_only = $4, updated_at = now()
       WHERE id = $3
       RETURNING id, title, content, created_at, updated_at, is_teacher_only`,
      [title, content, id, is_teacher_only || false]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
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

export async function DELETE(request) {
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
