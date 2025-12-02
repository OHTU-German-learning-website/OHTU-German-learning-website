import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const type = searchParams.get("type"); // We MUST have the type

  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  try {
    // FIX: Filter by BOTH slug AND page_group so we don't get the Resource page
    let query = `SELECT title, content FROM html_pages WHERE slug = $1`;
    let params = [slug];

    if (type) {
      query += ` AND page_group = $2`;
      params.push(type);
    }

    const result = await DB.pool(query, params);

    if (result.rowCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
