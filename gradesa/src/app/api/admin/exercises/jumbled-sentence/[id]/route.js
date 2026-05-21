import { NextResponse } from "next/server";
import { jumbledSentenceExerciseSchema } from "@/shared/schemas/jumbled-sentence.schemas";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  const { id } = await params;
  try {
    const exRes = await DB.pool(
      `SELECT id, title FROM jumbled_sentence_exercises WHERE id = $1`,
      [id]
    );
    if (!exRes.rows.length) {
      return NextResponse.json({ exercise: null }, { status: 404 });
    }
    const exercise = exRes.rows[0];
    const sRes = await DB.pool(
      `SELECT sentence, alternates FROM jumbled_sentence_sentences WHERE jumbled_exercise_id = $1 ORDER BY id ASC`,
      [id]
    );
    exercise.sentences = sRes.rows.map((row) => ({
      sentence: row.sentence,
      alternates: row.alternates || [],
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
            "Ungültige Eingabe für Jumbled Sentence.",
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
          `DELETE FROM jumbled_sentence_sentences WHERE jumbled_exercise_id = $1`,
          [id]
        );
        for (const s of sentences) {
          await client.query(
            `INSERT INTO jumbled_sentence_sentences (jumbled_exercise_id, sentence, alternates) VALUES ($1, $2, $3)`,
            [id, s.sentence, s.alternates?.filter(Boolean) || []]
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
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  },
  { requireAdmin: true }
);
