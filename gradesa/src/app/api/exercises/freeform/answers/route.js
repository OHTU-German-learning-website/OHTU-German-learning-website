import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { z } from "zod";

export const POST = withAuth(
  withInputValidation(
    z.object({
      freeFormExerciseId: z.string(),
      answer: z.string(),
    }),
    async (request) => {
      try {
        const userId = request.user.id;

        const body = await request.json();
        const { freeFormExerciseId, answer } = body;

        if (!freeFormExerciseId || !answer) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
        }

        const { rows: matchingAnswers } = await DB.pool(
          `SELECT id, is_correct, feedback 
         FROM free_form_answers 
         WHERE free_form_exercise_id = $1 AND answer = $2`,
          [freeFormExerciseId, answer]
        );

        if (matchingAnswers.length === 0) {
          await recordUserAnswer(userId, freeFormExerciseId, answer, false);

          return NextResponse.json({
            isCorrect: false,
            feedback:
              "Your answer doesn't match any of the expected answers. Please try again.",
          });
        }

        const matchedAnswer = matchingAnswers[0];

        await recordUserAnswer(
          userId,
          freeFormExerciseId,
          answer,
          matchedAnswer.is_correct
        );

        return NextResponse.json({
          isCorrect: matchedAnswer.is_correct,
          feedback:
            matchedAnswer.feedback ||
            (matchedAnswer.is_correct
              ? "Correct answer!"
              : "Incorrect answer. Please try again."),
        });
      } catch (error) {
        console.error("Error processing free form answer:", error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    }
  )
);

async function recordUserAnswer(userId, freeFormExerciseId, answer, isCorrect) {
  try {
    await DB.pool(
      `INSERT INTO free_form_user_answers 
       (answer, free_form_exercise_id, is_correct, user_id) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, free_form_exercise_id) 
       DO UPDATE SET 
         answer = $1, 
         is_correct = $3, 
         updated_at = NOW()`,
      [answer, freeFormExerciseId, isCorrect, userId]
    );
  } catch (error) {
    console.error("Error recording user answer:", error);
    throw error;
  }
}
