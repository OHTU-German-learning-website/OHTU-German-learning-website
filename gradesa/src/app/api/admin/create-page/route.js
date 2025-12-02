import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { checkSession } from "@/backend/auth/session";

export async function POST(request) {
  try {
    const user = await checkSession(request);
    if (!user || !user.is_admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { title, content, slug, page_group, page_order } = body;

    const query = `
      INSERT INTO html_pages (title, content, slug, page_group, page_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [title, content, slug, page_group, page_order || 100];
    const result = await DB.pool(query, values);

    return NextResponse.json(
      { message: "Created", page: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
