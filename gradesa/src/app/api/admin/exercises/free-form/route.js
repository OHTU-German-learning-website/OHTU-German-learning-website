import { z } from "zod";
import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { DB } from "@/backend/db";
import { freeFormExerciseSchema } from "@/shared/schemas/free-form.schemas";
import { NextResponse } from "next/server";
export const POST = withAuth(
  withInputValidation(freeFormExerciseSchema, async (req) => {
    const body = await req.json();
    const { question, answers } = body;
    const hasValidAnswers = answers.some((answer) => answer.is_correct);

    if (!hasValidAnswers) {
      return NextResponse.json(
        { error: "At least one answer must be correct" },
        { status: 422 }
      );
    }

    const exerciseId = await DB.transaction(async (tx) => {
      const exercise = await tx.query(`
        INSERT INTO exercises DEFAULT VALUES RETURNING id
      `);

      const exerciseId = exercise.rows[0].id;
      const freeFormExercise = await tx.query(
        `
        INSERT INTO free_form_exercises (exercise_id, question)
        VALUES ($1, $2)
        RETURNING id
      `,
        [exerciseId, question]
      );
      const freeFormExerciseId = freeFormExercise.rows[0].id;
      for (const answer of answers) {
        const insertedAnswer = await tx.query(
          `
        INSERT INTO free_form_answers (free_form_exercise_id, answer, is_correct, feedback)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
          [
            freeFormExerciseId,
            answer.answer,
            answer.is_correct,
            answer.feedback,
          ]
        );
      }

      return exerciseId;
    });
    return NextResponse.json({ success: true, exercise_id: exerciseId });
  }),
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
