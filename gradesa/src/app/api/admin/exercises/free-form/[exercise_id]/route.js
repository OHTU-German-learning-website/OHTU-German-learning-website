import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(
  async (request, { params }) => {
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
          id,
          question,
          question_order
        FROM free_form_questions
        WHERE free_form_exercise_id = $1
        ORDER BY question_order ASC
      `,
        [exercise_id]
      );

      const questionIds = questionRows.map((q) => q.id);

      let answerRows = [];
      if (questionIds.length > 0) {
        const result = await DB.pool(
          `
          SELECT 
            id,
            free_form_question_id,
            answer,
            is_correct,
            feedback
          FROM free_form_answers
          WHERE free_form_question_id = ANY($1::bigint[])
          ORDER BY id ASC
        `,
          [questionIds]
        );
        answerRows = result.rows;
      }

      const questions = questionRows.map((q) => ({
        ...q,
        answers: answerRows.filter(
          (answer) => answer.free_form_question_id === q.id
        ),
      }));

      return NextResponse.json({
        ...exerciseRows[0],
        questions,
      });
    } catch (error) {
      console.error("Error fetching free form exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const PUT = withAuth(
  async (request, { params }) => {
    try {
      const { exercise_id } = await params;
      const body = await request.json();
      const { title, questions } = body;

      const hasValidAnswerBalance = questions.every(
        (q) =>
          q.answers.some((a) => a.is_correct) &&
          q.answers.some((a) => !a.is_correct)
      );

      if (!hasValidAnswerBalance) {
        return NextResponse.json(
          { error: "Jede Frage muss mindestens eine richtige Antwort haben." },
          { status: 422 }
        );
      }

      await DB.transaction(async (tx) => {
        const { rows } = await tx.query(
          `
          SELECT id
          FROM free_form_exercises
          WHERE id = $1
        `,
          [exercise_id]
        );

        if (rows.length === 0) {
          throw new Error("Exercise not found");
        }

        await tx.query(
          `
          UPDATE free_form_exercises
          SET title = $1, updated_at = NOW()
          WHERE id = $2
        `,
          [title, exercise_id]
        );

        await tx.query(
          `
          DELETE FROM free_form_answers
          WHERE free_form_exercise_id = $1
        `,
          [exercise_id]
        );

        await tx.query(
          `
          DELETE FROM free_form_questions
          WHERE free_form_exercise_id = $1
        `,
          [exercise_id]
        );

        for (let i = 0; i < questions.length; i++) {
          const currentQuestion = questions[i];

          const insertedQuestion = await tx.query(
            `
            INSERT INTO free_form_questions
            (free_form_exercise_id, question, question_order)
            VALUES ($1, $2, $3)
            RETURNING id
          `,
            [exercise_id, currentQuestion.question, i + 1]
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
                exercise_id,
                freeFormQuestionId,
                answer.answer,
                answer.is_correct,
                answer.feedback,
              ]
            );
          }
        }
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error updating free form exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const DELETE = withAuth(
  async (request, { params }) => {
    try {
      const { exercise_id } = await params;

      const { rows } = await DB.pool(
        `
        SELECT exercise_id
        FROM free_form_exercises
        WHERE id = $1
      `,
        [exercise_id]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      const parentExerciseId = rows[0].exercise_id;

      await DB.pool(
        `
        DELETE FROM exercises
        WHERE id = $1
      `,
        [parentExerciseId]
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting free form exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
