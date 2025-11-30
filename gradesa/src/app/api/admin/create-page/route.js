import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { checkSession } from "@/backend/auth/session";

export async function POST(request) {
  try {
    // 1. SECURITY: Check if user is logged in
    const user = await checkSession(request);

    // 2. AUTHORIZATION: Check if user is Admin
    // We check the user object returned by your session logic
    if (!user || !user.is_admin) {
      return NextResponse.json(
        { error: "Forbidden: You must be an admin to perform this action." },
        { status: 403 }
      );
    }

    // 3. GET DATA FROM FORM
    const body = await request.json();
    const { title, content, slug, page_group, page_order } = body;

    // Basic Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Missing required fields (title, slug, or content)" },
        { status: 400 }
      );
    }

    // 4. SAVE TO DATABASE
    const query = `
      INSERT INTO html_pages (title, content, slug, page_group, page_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      title,
      content,
      slug,
      page_group || "grammar",
      page_order || 0,
    ];

    const result = await DB.pool(query, values);

    return NextResponse.json(
      { message: "Page created successfully", page: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Page Error:", error);

    // Handle duplicate slug error (Postgres error code 23505 is unique violation)
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A page with this URL slug already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
