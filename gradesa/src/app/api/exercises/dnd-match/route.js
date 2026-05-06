import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
  try {
    const { rows } = await DB.pool(
      `SELECT
         dme.id,
         dme.title,
         dme.description,
         e.created_at
       FROM dnd_match_exercises dme
       JOIN exercises e ON dme.exercise_id = e.id
       ORDER BY e.created_at DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching dnd_match exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
