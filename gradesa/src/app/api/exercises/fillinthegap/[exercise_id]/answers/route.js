import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { fillGapSubmitSchema } from "@/shared/schemas/fillinthegap.schemas";

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const POST = withAuth(
  withInputValidation(fillGapSubmitSchema, async (request, { params }) => {
    try {
      const { exercise_id } = await params;
      const body = await request.json();
      const { answers } = body;
      const userId = request.user.id;

      const submittedByGapId = new Map();
      for (const item of answers) {
        const gapId = String(item.gapId);
        if (gapId) {
          submittedByGapId.set(gapId, item.answer ?? "");
        }
      }

      if (submittedByGapId.size === 0) {
        return NextResponse.json(
          { error: "At least one gap answer is required" },
          { status: 422 }
        );
      }

      const { rows: gapRows } = await DB.pool(
        `SELECT id, token_index, token_text, gap_order
         FROM fill_gap_gaps
         WHERE fill_gap_exercise_id = $1
         ORDER BY gap_order ASC`,
        [exercise_id]
      );

      if (gapRows.length === 0) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      const gapIds = gapRows.map((gap) => gap.id);

      const { rows: answerRows } = await DB.pool(
        `SELECT id, fill_gap_gap_id, answer, is_correct, feedback
         FROM fill_gap_answers
         WHERE fill_gap_gap_id = ANY($1::bigint[])`,
        [gapIds]
      );

      const answersByGap = new Map();
      for (const answer of answerRows) {
        const key = String(answer.fill_gap_gap_id);
        const current = answersByGap.get(key) || [];
        current.push(answer);
        answersByGap.set(key, current);
      }

      const results = [];

      for (const gap of gapRows) {
        const gapId = String(gap.id);
        const rawAnswer = submittedByGapId.get(gapId) || "";
        const normalizedInput = normalize(rawAnswer);
        const options = answersByGap.get(gapId) || [];

        const matched = options.find(
          (option) => normalize(option.answer) === normalizedInput
        );

        const isCorrect = matched ? matched.is_correct : false;
        const feedback = matched
          ? matched.feedback
          : "Antwort nicht erkannt. Bitte versuche es erneut.";

        await DB.pool(
          `INSERT INTO fill_gap_user_answers (user_id, fill_gap_gap_id, answer, is_correct, feedback)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (user_id, fill_gap_gap_id)
           DO UPDATE SET
             answer = $3,
             is_correct = $4,
             feedback = $5,
             updated_at = NOW()`,
          [userId, gap.id, rawAnswer, isCorrect, feedback]
        );

        results.push({
          gapId: gap.id,
          tokenIndex: gap.token_index,
          tokenText: gap.token_text,
          answer: rawAnswer,
          isCorrect,
          feedback,
        });
      }

      const correctCount = results.filter((result) => result.isCorrect).length;

      return NextResponse.json({
        results,
        correctCount,
        total: results.length,
      });
    } catch (error) {
      console.error("Error evaluating fill-in-the-gap answers:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  })
);
