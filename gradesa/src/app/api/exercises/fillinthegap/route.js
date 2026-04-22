import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
  try {
    const { rows } = await DB.pool(
      `SELECT
         fge.id,
         fge.title,
         e.created_at
       FROM fill_gap_exercises fge
       JOIN exercises e ON e.id = fge.exercise_id
       ORDER BY e.created_at DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching fill-in-the-gap exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
