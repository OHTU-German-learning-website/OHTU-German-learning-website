import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { checkSession } from "@/backend/auth/session";

export async function DELETE(request) {
  try {
    const user = await checkSession(request);
    if (!user || !user.is_admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { slug, page_group } = body;

    // FIX: Delete specific group only
    const query = `DELETE FROM html_pages WHERE slug = $1 AND page_group = $2 RETURNING *`;
    const result = await DB.pool(query, [slug, page_group]);

    if (result.rowCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
