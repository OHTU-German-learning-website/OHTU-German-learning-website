import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
  try {
    const { rows } = await DB.pool(`
      SELECT
        dnd.id AS dnd_id,
        dnd.title,
        e.created_at
      FROM dnd_exercises dnd
      JOIN exercises e ON dnd.exercise_id = e.id
      ORDER BY e.created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching dragdrop exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
