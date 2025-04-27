import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { logger } from "@/backend/logging";

export async function GET(_request, { params }) {
  try {
    const { anchor_id } = await params;

    const exercisesResult = await DB.pool(
      `SELECT 
        ea.exercise_id,
        e.id,
        e.category
      FROM anchors a
      INNER JOIN exercise_anchors ea ON a.id = ea.anchor_id
      INNER JOIN exercises e ON ea.exercise_id = e.id
      WHERE a.anchor_id = $1
      ORDER BY ea.position`,
      [anchor_id]
    );

    return NextResponse.json(exercisesResult.rows);
  } catch (error) {
    logger.error("Error fetching anchored exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
