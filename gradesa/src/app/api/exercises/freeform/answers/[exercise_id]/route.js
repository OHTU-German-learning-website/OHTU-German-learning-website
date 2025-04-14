import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  try {
    const { exercise_id } = params;

    // First verify that the exercise exists
    const { rows: exerciseRows } = await DB.pool(
      `SELECT id FROM free_form_exercises WHERE id = $1`,
      [exercise_id]
    );

    if (exerciseRows.length === 0) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    // Get all possible answers and feedback for this exercise
    const { rows: answerRows } = await DB.pool(
      `SELECT 
        id, 
        answer, 
        is_correct, 
        feedback 
       FROM free_form_answers 
       WHERE free_form_exercise_id = $1
       ORDER BY is_correct DESC, id ASC`,
      [exercise_id]
    );

    // Get user's answer history for this exercise if available
    const userId = request.user.id;
    const { rows: userAnswerRows } = await DB.pool(
      `SELECT 
        answer, 
        is_correct, 
        created_at, 
        updated_at
       FROM free_form_user_answers 
       WHERE free_form_exercise_id = $1 AND user_id = $2
       ORDER BY updated_at DESC`,
      [exercise_id, userId]
    );

    return NextResponse.json({
      possibleAnswers: answerRows,
      userAnswers: userAnswerRows,
    });
  } catch (error) {
    console.error("Error fetching free form exercise answers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
