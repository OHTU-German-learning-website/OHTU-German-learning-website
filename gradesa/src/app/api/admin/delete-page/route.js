import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { checkSession } from "@/backend/auth/session";

export async function DELETE(request) {
  try {
    // 1. SECURITY: Check if user is logged in
    const user = await checkSession(request);

    // 2. AUTHORIZATION: Check if user is Admin
    if (!user || !user.is_admin) {
      return NextResponse.json(
        { error: "Forbidden: You must be an admin to delete pages." },
        { status: 403 }
      );
    }

    // 3. GET THE SLUG TO DELETE
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    // 4. DELETE FROM DATABASE
    const query = `DELETE FROM html_pages WHERE slug = $1 RETURNING *`;
    const result = await DB.pool(query, [slug]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Page deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Page Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
