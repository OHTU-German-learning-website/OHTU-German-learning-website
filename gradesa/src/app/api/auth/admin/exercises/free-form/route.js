const feedbackSchema = z.object({
  feedback: z.string().min(1, { message: "Feedback is required" }),
});

const answerSchema = z.object({
  answer: z.string().min(1, { message: "Answer is required" }),
  feedback: z.array(feedbackSchema).optional(),
});

const schema = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  answers: z
    .array(answerSchema)
    .min(1, { message: "At least one answer is required" }),
});

export const POST = withAuth(
  withInputValidation(schema, async (req) => {
    const { question } = req.body;

    await DB.transaction(async (tx) => {
      const exercise = await tx.query(`
        INSERT INTO exercises RETURNING id;
      `);

      const exerciseId = exercise.rows[0].id;

      await tx.query(
        `
        INSERT INTO free_form_exercises (exercise_id, question)
        VALUES ($1, $2)
        RETURNING id;
      `,
        [exerciseId, question]
      );

      const freeFormExerciseId = freeFormExercise.rows[0].id;
    });
  }),
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
