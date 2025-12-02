import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { checkSession } from "@/backend/auth/session";

export async function PUT(request) {
  try {
    const user = await checkSession(request);
    if (!user || !user.is_admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { originalSlug, title, slug, content, page_order, page_group } = body;

    // FIX: Update specific group only
    const query = `
      UPDATE html_pages
      SET title = $1, slug = $2, content = $3, page_order = $4
      WHERE slug = $5 AND page_group = $6
      RETURNING *;
    `;
    const values = [title, slug, content, page_order, originalSlug, page_group];
    const result = await DB.pool(query, values);

    if (result.rowCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
