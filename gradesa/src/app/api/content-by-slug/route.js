import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET(request) {
  // 1. Get the "slug" from the URL (e.g. ?slug=test-page)
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  try {
    // 2. Find the page in the database
    const query = `SELECT title, content FROM html_pages WHERE slug = $1`;
    const result = await DB.pool(query, [slug]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // 3. Return the content
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
