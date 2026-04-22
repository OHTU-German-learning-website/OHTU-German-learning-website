import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { fillGapCreateSchema } from "@/shared/schemas/fillinthegap.schemas";
import {
  htmlToPlainText,
  normalizePlainText,
} from "@/shared/utils/normalizeEditorText";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

function sanitizeHtml(html) {
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  return purify.sanitize(String(html || ""), { ADD_ATTR: ["target"] });
}

export const GET = withAuth(
  async (request, { params }) => {
    try {
      const { exercise_id } = await params;

      const { rows: exerciseRows } = await DB.pool(
        `SELECT id, exercise_id, title, source_text, source_html
         FROM fill_gap_exercises
         WHERE id = $1`,
        [exercise_id]
      );

      if (exerciseRows.length === 0) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      const { rows: gapRows } = await DB.pool(
        `SELECT id, token_index, token_text, gap_order
         FROM fill_gap_gaps
         WHERE fill_gap_exercise_id = $1
         ORDER BY gap_order ASC`,
        [exercise_id]
      );

      const gapIds = gapRows.map((gap) => gap.id);

      let answerRows = [];
      if (gapIds.length > 0) {
        const answerResult = await DB.pool(
          `SELECT id, fill_gap_gap_id, answer, is_correct, feedback
           FROM fill_gap_answers
           WHERE fill_gap_gap_id = ANY($1::bigint[])
           ORDER BY id ASC`,
          [gapIds]
        );
        answerRows = answerResult.rows;
      }

      const gaps = gapRows.map((gap) => ({
        ...gap,
        answers: answerRows.filter(
          (answer) => answer.fill_gap_gap_id === gap.id
        ),
      }));

      return NextResponse.json({
        ...exerciseRows[0],
        gaps,
      });
    } catch (error) {
      console.error("Error fetching fill-in-the-gap exercise:", error);
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
      const parsed = fillGapCreateSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: parsed.error.issues[0]?.message || "Validation error",
            issues: parsed.error.issues,
          },
          { status: 422 }
        );
      }

      const { title, text, textHtml, gaps } = parsed.data;
      const normalizedText = normalizePlainText(
        text || htmlToPlainText(textHtml || "")
      );
      const sourceHtml = sanitizeHtml(textHtml || "");

      await DB.transaction(async (tx) => {
        const { rows } = await tx.query(
          `SELECT exercise_id
           FROM fill_gap_exercises
           WHERE id = $1`,
          [exercise_id]
        );

        if (rows.length === 0) {
          throw new Error("Exercise not found");
        }

        await tx.query(
          `UPDATE fill_gap_exercises
           SET title = $1, source_text = $2, source_html = $3, updated_at = NOW()
           WHERE id = $4`,
          [title, normalizedText, sourceHtml, exercise_id]
        );

        await tx.query(
          `DELETE FROM fill_gap_gaps
           WHERE fill_gap_exercise_id = $1`,
          [exercise_id]
        );

        const sortedGaps = [...gaps].sort(
          (a, b) => a.tokenIndex - b.tokenIndex
        );

        for (let i = 0; i < sortedGaps.length; i++) {
          const gap = sortedGaps[i];

          const gapResult = await tx.query(
            `INSERT INTO fill_gap_gaps (fill_gap_exercise_id, token_index, token_text, gap_order)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [exercise_id, gap.tokenIndex, gap.tokenText, i + 1]
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
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      if (error.message === "Exercise not found") {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      console.error("Error updating fill-in-the-gap exercise:", error);
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
        `SELECT exercise_id
         FROM fill_gap_exercises
         WHERE id = $1`,
        [exercise_id]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      await DB.pool(`DELETE FROM exercises WHERE id = $1`, [
        rows[0].exercise_id,
      ]);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting fill-in-the-gap exercise:", error);
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
