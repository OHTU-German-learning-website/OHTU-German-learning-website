import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  try {
    const { exercise_id } = await params;

    const { rows: exerciseRows } = await DB.pool(
      `
      SELECT 
        id,
        title,
        exercise_id
      FROM free_form_exercises 
      WHERE id = $1
    `,
      [exercise_id]
    );

    if (exerciseRows.length === 0) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const { rows: questionRows } = await DB.pool(
      `
      SELECT
        ffq.id,
        ffq.question,
        ffq.question_order,
        COALESCE(
          ARRAY_AGG(ffa.answer ORDER BY ffa.id)
          FILTER (WHERE ffa.is_correct = TRUE),
          '{}'
        ) AS correct_answers
      FROM free_form_questions ffq
      LEFT JOIN free_form_answers ffa
        ON ffa.free_form_exercise_id = ffq.free_form_exercise_id
        AND ffa.free_form_question_id = ffq.id
      WHERE ffq.free_form_exercise_id = $1
      GROUP BY ffq.id, ffq.question, ffq.question_order
      ORDER BY ffq.question_order ASC
    `,
      [exercise_id]
    );

    return NextResponse.json({
      ...exerciseRows[0],
      questions: questionRows,
    });
  } catch (error) {
    console.error("Error fetching free form exercise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
