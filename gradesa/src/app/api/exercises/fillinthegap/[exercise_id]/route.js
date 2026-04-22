import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  try {
    const { exercise_id } = await params;

    const { rows: exerciseRows } = await DB.pool(
      `SELECT id, title, source_text, source_html
       FROM fill_gap_exercises
       WHERE id = $1`,
      [exercise_id]
    );

    if (exerciseRows.length === 0) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const { rows: gapRows } = await DB.pool(
      `SELECT id, token_index, token_text, gap_order
       FROM fill_gap_gaps
       WHERE fill_gap_exercise_id = $1
       ORDER BY gap_order ASC`,
      [exercise_id]
    );

    const userId = request.user.id;
    const { rows: userAnswers } = await DB.pool(
      `SELECT fill_gap_gap_id, answer, is_correct, feedback, updated_at
       FROM fill_gap_user_answers
       WHERE user_id = $1
         AND fill_gap_gap_id = ANY(
           SELECT id FROM fill_gap_gaps WHERE fill_gap_exercise_id = $2
         )`,
      [userId, exercise_id]
    );

    return NextResponse.json({
      ...exerciseRows[0],
      gaps: gapRows,
      userAnswers,
    });
  } catch (error) {
    console.error("Error fetching fill-in-the-gap exercise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
