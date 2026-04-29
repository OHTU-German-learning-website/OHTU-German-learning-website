import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { DB } from "@/backend/db";
import { freeFormExerciseSchema } from "@/shared/schemas/free-form.schemas";
import { NextResponse } from "next/server";

export const POST = withAuth(
  withInputValidation(freeFormExerciseSchema, async (req) => {
    const body = await req.json();
    const { title, questions } = body;

    const hasValidAnswerBalance = questions.every(
      (q) =>
        q.answers.some((answer) => answer.is_correct) &&
        q.answers.some((answer) => !answer.is_correct)
    );

    if (!hasValidAnswerBalance) {
      return NextResponse.json(
        {
          error:
            "Jede Frage muss mindestens eine richtige und eine falsche Antwort haben.",
        },
        { status: 422 }
      );
    }

    const exerciseId = await DB.transaction(async (tx) => {
      const exercise = await tx.query(`
        INSERT INTO exercises (created_at, updated_at, category) VALUES (NOW(), NOW(), 'freeform') RETURNING id
      `);

      const exerciseId = exercise.rows[0].id;
      const freeFormExercise = await tx.query(
        `
        INSERT INTO free_form_exercises (exercise_id, title)
        VALUES ($1, $2)
        RETURNING id
      `,
        [exerciseId, title]
      );

      const freeFormExerciseId = freeFormExercise.rows[0].id;

      for (let i = 0; i < questions.length; i++) {
        const currentQuestion = questions[i];

        const insertedQuestion = await tx.query(
          `
        INSERT INTO free_form_questions (free_form_exercise_id, question, question_order)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
          [freeFormExerciseId, currentQuestion.question, i + 1]
        );
        const freeFormQuestionId = insertedQuestion.rows[0].id;

        for (const answer of currentQuestion.answers) {
          await tx.query(
            `
            INSERT INTO free_form_answers 
            (free_form_exercise_id, free_form_question_id, answer, is_correct, feedback)
            VALUES ($1, $2, $3, $4, $5)
          `,
            [
              freeFormExerciseId,
              freeFormQuestionId,
              answer.answer,
              answer.is_correct,
              answer.feedback,
            ]
          );
        }
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
