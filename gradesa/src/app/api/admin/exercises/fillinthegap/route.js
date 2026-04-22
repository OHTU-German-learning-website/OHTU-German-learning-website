import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { fillGapCreateSchema } from "@/shared/schemas/fillinthegap.schemas";
import {
  htmlToPlainText,
  normalizePlainText,
} from "@/shared/utils/normalizeEditorText";
import { NextResponse } from "next/server";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

function sanitizeHtml(html) {
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  return purify.sanitize(String(html || ""), { ADD_ATTR: ["target"] });
}

export const POST = withAuth(
  withInputValidation(fillGapCreateSchema, async (request) => {
    const body = await request.json();
    const { title, text, textHtml, gaps } = body;
    const normalizedText = normalizePlainText(
      text || htmlToPlainText(textHtml || "")
    );
    const sourceHtml = sanitizeHtml(textHtml || "");

    const created = await DB.transaction(async (tx) => {
      const exerciseResult = await tx.query(
        `INSERT INTO exercises (created_at, updated_at, category)
         VALUES (NOW(), NOW(), 'fillinthegap')
         RETURNING id`
      );

      const exerciseId = exerciseResult.rows[0].id;

      const fillGapExerciseResult = await tx.query(
        `INSERT INTO fill_gap_exercises (exercise_id, title, source_text, source_html)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [exerciseId, title, normalizedText, sourceHtml]
      );

      const fillGapExerciseId = fillGapExerciseResult.rows[0].id;

      const sortedGaps = [...gaps].sort((a, b) => a.tokenIndex - b.tokenIndex);

      for (let i = 0; i < sortedGaps.length; i++) {
        const gap = sortedGaps[i];

        const gapResult = await tx.query(
          `INSERT INTO fill_gap_gaps (fill_gap_exercise_id, token_index, token_text, gap_order)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [fillGapExerciseId, gap.tokenIndex, gap.tokenText, i + 1]
        );

        const gapId = gapResult.rows[0].id;

        for (const answer of gap.answers) {
          await tx.query(
            `INSERT INTO fill_gap_answers (fill_gap_gap_id, answer, is_correct, feedback)
             VALUES ($1, $2, $3, $4)`,
            [gapId, answer.answer, answer.isCorrect, answer.feedback]
          );
        }
      }

      return {
        id: fillGapExerciseId,
        exerciseId,
      };
    });

    return NextResponse.json(
      {
        id: created.id,
        exercise_id: created.exerciseId,
      },
      { status: 201 }
    );
  }),
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
