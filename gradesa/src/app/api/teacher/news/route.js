import { DB } from "@/backend/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const articles = await DB.pool(
      `SELECT id, title, content, created_at, updated_at, is_teacher_only
       FROM news_articles 
       ORDER BY is_teacher_only DESC, created_at DESC`
    );

    return NextResponse.json(articles.rows);
  } catch (error) {
    console.error("Error fetching teacher news articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher news articles" },
      { status: 500 }
    );
  }
}
