import { DB } from "@/backend/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const articles = await DB.pool(
      `SELECT id, title, content, created_at, updated_at, is_teacher_only
       FROM news_articles 
       WHERE is_teacher_only = false
       ORDER BY created_at DESC`
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
