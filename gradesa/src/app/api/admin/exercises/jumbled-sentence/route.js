import { NextResponse } from "next/server";
import { jumbledSentenceExerciseSchema } from "@/shared/schemas/jumbled-sentence.schemas";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { saveBackup } from "@/backend/backups";

export const POST = withAuth(
  async (request) => {
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
    const { title, instructionText, sentences } = parseResult.data;
    const normalizedInstructionText = String(instructionText || "").trim();
    const created_by = request.user.id;
    try {
      const result = await DB.transaction(async (client) => {
        const exerciseRes = await client.query(
          `INSERT INTO exercises (created_at, updated_at, category, created_by, updated_by) VALUES (NOW(), NOW(), $1, $2, $2) RETURNING id`,
          ["jumbled-sentence", created_by]
        );
        const exercise_id = exerciseRes.rows[0].id;
        const jumbledRes = await client.query(
          `INSERT INTO jumbled_sentence_exercises (created_at, updated_at, exercise_id, created_by, title, instruction_text) VALUES (NOW(), NOW(), $1, $2, $3, $4) RETURNING id`,
          [exercise_id, created_by, title, normalizedInstructionText || null]
        );
        const jumbled_id = jumbledRes.rows[0].id;
        for (const s of sentences) {
          await client.query(
            `INSERT INTO jumbled_sentence_sentences (jumbled_exercise_id, sentence, alternates, correct_feedback, alternate_feedbacks, incorrect_feedbacks, incorrect_alternates) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              jumbled_id,
              s.sentence,
              s.alternates?.filter(Boolean) || [],
              s.correctSentenceFeedback || null,
              s.alternateFeedbacks || [],
              s.incorrectFeedbacks || [],
              s.incorrectAlternates || [],
            ]
          );
        }
        return { id: jumbled_id };
      });
      try {
        await saveBackup(
          "jumbled_sentence_exercises",
          result.id,
          {
            id: result.id,
            title,
            instruction_text: normalizedInstructionText || null,
            sentences,
          },
          created_by ?? null
        );
      } catch (err) {
        console.error("Failed to save jumbled-sentence backup:", err);
      }

      return NextResponse.json({ success: true, id: result.id });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  },
  { requireAdmin: true }
);

export const GET = withAuth(
  async () => {
    try {
      const res = await DB.pool(
        `SELECT id, title, instruction_text FROM jumbled_sentence_exercises ORDER BY id DESC`
      );
      return NextResponse.json({ exercises: res.rows });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  },
  { requireAdmin: true }
);
