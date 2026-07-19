import { NextResponse } from "next/server";
import { jumbledSentenceExerciseSchema } from "@/shared/schemas/jumbled-sentence.schemas";
import { DB } from "@/backend/db";
import { canDeleteOwnedContent } from "@/backend/content-permissions";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  const { id } = await params;
  try {
    const exRes = await DB.pool(
      `SELECT
         jse.id,
         jse.title,
         e.updated_at AS last_modified_at,
         COALESCE(NULLIF(u.username, ''), u.email) AS last_modified_by
       FROM jumbled_sentence_exercises jse
       JOIN exercises e ON e.id = jse.exercise_id
       LEFT JOIN users u ON u.id = COALESCE(e.updated_by, e.created_by)
       WHERE jse.id = $1`,
      [id]
    );
    if (!exRes.rows.length) {
      return NextResponse.json({ exercise: null }, { status: 404 });
    }
    const exercise = exRes.rows[0];
    const sRes = await DB.pool(
      `SELECT sentence, alternates, correct_feedback, alternate_feedbacks, incorrect_feedbacks, incorrect_alternates FROM jumbled_sentence_sentences WHERE jumbled_exercise_id = $1 ORDER BY id ASC`,
      [id]
    );
    exercise.sentences = sRes.rows.map((row) => ({
      sentence: row.sentence,
      alternates: row.alternates || [],
      correctSentenceFeedback: row.correct_feedback || "",
      alternateFeedbacks: row.alternate_feedbacks || [],
      incorrectFeedbacks: row.incorrect_feedbacks || [],
      incorrectAlternates: row.incorrect_alternates || [],
    }));
    return NextResponse.json({ exercise });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});

export const PUT = withAuth(
  async (request, { params }) => {
    const { id } = await params;
    const body = await request.json();
    const parseResult = jumbledSentenceExerciseSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error:
            parseResult.error.issues[0]?.message ||
            "Ungültige Eingabe für Satzmix-Übung.",
          issues: parseResult.error.issues,
        },
        { status: 400 }
      );
    }
    const { title, sentences } = parseResult.data;
    try {
      await DB.transaction(async (client) => {
        await client.query(
          `UPDATE jumbled_sentence_exercises SET title = $1, updated_at = NOW() WHERE id = $2`,
          [title, id]
        );
        await client.query(
          `UPDATE exercises
           SET updated_by = $1
           WHERE id = (
             SELECT exercise_id
             FROM jumbled_sentence_exercises
             WHERE id = $2
           )`,
          [request.user?.id ?? null, id]
        );
        await client.query(
          `DELETE FROM jumbled_sentence_sentences WHERE jumbled_exercise_id = $1`,
          [id]
        );
        for (const s of sentences) {
          await client.query(
            `INSERT INTO jumbled_sentence_sentences (jumbled_exercise_id, sentence, alternates, correct_feedback, alternate_feedbacks, incorrect_feedbacks, incorrect_alternates) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              id,
              s.sentence,
              s.alternates?.filter(Boolean) || [],
              s.correctSentenceFeedback || null,
              s.alternateFeedbacks || [],
              s.incorrectFeedbacks || [],
              s.incorrectAlternates || [],
            ]
          );
        }
      });
      return NextResponse.json({ success: true });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  },
  { requireAdmin: true }
);

export const DELETE = withAuth(
  async (request, { params }) => {
    const { id } = await params;
    try {
      await DB.transaction(async (client) => {
        const { rows } = await client.query(
          `SELECT jse.exercise_id, e.created_by
           FROM jumbled_sentence_exercises jse
           JOIN exercises e ON e.id = jse.exercise_id
           WHERE jse.id = $1`,
          [id]
        );

        if (rows.length === 0) {
          throw new Error("NOT_FOUND");
        }

        if (!canDeleteOwnedContent(request.user, rows[0].created_by)) {
          throw new Error("FORBIDDEN");
        }

        await client.query(
          `DELETE FROM jumbled_sentence_sentences WHERE jumbled_exercise_id = $1`,
          [id]
        );
        await client.query(
          `DELETE FROM jumbled_sentence_exercises WHERE id = $1`,
          [id]
        );
      });
      return NextResponse.json({ success: true });
    } catch (err) {
      if (err.message === "FORBIDDEN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (err.message === "NOT_FOUND") {
        return NextResponse.json({ error: "Übung nicht gefunden." }, { status: 404 });
      }
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  },
  { requireAdmin: true }
);
