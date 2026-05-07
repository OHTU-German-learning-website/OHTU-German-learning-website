import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id || Number.isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Ungültige Übungs-ID." },
      { status: 400 }
    );
  }

  try {
    const { rows: exerciseRows } = await DB.pool(
      `SELECT
         me.id AS memory_game_exercise_id,
         e.id AS exercise_id,
         me.title,
         me.description,
         e.created_at
       FROM memory_game_exercises me
       JOIN exercises e ON me.exercise_id = e.id
       WHERE me.id = $1`,
      [id]
    );

    if (exerciseRows.length === 0) {
      return NextResponse.json(
        { error: "Übung nicht gefunden." },
        { status: 404 }
      );
    }

    const { rows: pairs } = await DB.pool(
      `SELECT id, left_item, right_item, pair_order
       FROM memory_game_pairs
       WHERE memory_game_exercise_id = $1
       ORDER BY pair_order ASC`,
      [id]
    );

    return NextResponse.json({ ...exerciseRows[0], pairs });
  } catch (error) {
    console.error("Error fetching memory game exercise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
