import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    const query = `
      SELECT id, title, slug
      FROM html_pages
      WHERE page_group = $1
      ORDER BY page_order ASC
    `;
    const result = await DB.pool(query, [type]);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
