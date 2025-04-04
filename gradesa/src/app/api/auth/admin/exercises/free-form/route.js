import { z } from "zod";
import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { DB } from "@/backend/db";

const answerSchema = z.object({
  answer: z.string().min(1, { message: "Answer is required" }),
  feedback: z.string().min(1, {
    message: "Feedback is required",
  }),
  is_correct: z.boolean(),
});

const schema = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  answers: z
    .array(answerSchema)
    .min(1, { message: "At least one answer is required" }),
});

export const POST = withAuth(
  withInputValidation(schema, async (req) => {
    const { question, answers } = req.body;

    await DB.transaction(async (tx) => {
      const exercise = await tx.query(`
        INSERT INTO exercises RETURNING id;
      `);

      const exerciseId = exercise.rows[0].id;
      const freeFormExercise = await tx.query(
        `
        INSERT INTO free_form_exercises (exercise_id, question)
        VALUES ($1, $2)
        RETURNING id;
      `,
        [exerciseId, question]
      );
      const freeFormExerciseId = freeFormExercise.rows[0].id;
      for (const answer of answers) {
        const insertedAnswer = await tx.query(
          `
        INSERT INTO free_form_answers (free_form_exercise_id, answer)
        VALUES ($1, $2)
        RETURNING id;
      `,
          [freeFormExerciseId, answer]
        );

        const answerId = insertedAnswer.rows[0].id;

        for (const { feedback, answer } of answer.feedbacks) {
          await tx.query(
            `
        INSERT INTO free_form_answer_feedbacks (answer_id, feedback, answer)
        VALUES ($1, $2, $3)
      `,
            [answerId, feedback, answer]
          );
        }
      }

      return exerciseId;
    });
  }),
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
