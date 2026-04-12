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
        id,
        question,
        question_order
      FROM free_form_questions
      WHERE free_form_exercise_id = $1
      ORDER BY question_order ASC
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
