import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
  try {
    const { rows: exercises } = await DB.pool(
      `SELECT
         me.id AS memory_game_exercise_id,
         e.id AS exercise_id,
         me.title,
         me.description,
         e.created_at
       FROM memory_game_exercises me
       JOIN exercises e ON me.exercise_id = e.id
       ORDER BY e.created_at DESC`
    );

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Error fetching memory game exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
