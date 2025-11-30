import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
  try {
    // This SQL query specifically asks for the list of communication pages
    const query = `
      SELECT id, title, slug
      FROM html_pages
      WHERE page_group = 'communications'
      ORDER BY page_order ASC
    `;

    const result = await DB.pool(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching list:", error);
    // Return empty list instead of crashing if table is missing
    return NextResponse.json([], { status: 200 });
  }
}
