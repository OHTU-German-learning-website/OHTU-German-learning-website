import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { dndMatchSubmitSchema } from "@/shared/schemas/dnd-match.schemas";

export const POST = withAuth(async (request, { params }) => {
  try {
    const { match_id } = await params;

    if (!match_id || isNaN(parseInt(match_id, 10))) {
      return NextResponse.json(
        { error: "Ungültige Übungs-ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = dndMatchSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Ungültige Eingabe.",
          issues: parsed.error.issues,
        },
        { status: 422 }
      );
    }

    const { answers } = parsed.data;
    const userId = request.user.id;

    // Verify the exercise exists and fetch all its pairs for ownership validation
    const { rows: pairs } = await DB.pool(
      `SELECT id FROM dnd_match_pairs WHERE dnd_match_exercise_id = $1`,
      [match_id]
    );

    if (pairs.length === 0) {
      return NextResponse.json(
        { error: "Übung nicht gefunden oder hat keine Paare." },
        { status: 404 }
      );
    }

    const validPairIds = new Set(pairs.map((p) => parseInt(p.id, 10)));

    // Validate all submitted pair IDs belong to this exercise
    for (const answer of answers) {
      if (
        !validPairIds.has(answer.leftPairId) ||
        !validPairIds.has(answer.selectedRightPairId)
      ) {
        return NextResponse.json(
          { error: "Ungültige Paar-ID für diese Übung." },
          { status: 422 }
        );
      }
    }

    // Evaluate and persist — each answer is correct when the student matched the
    // right item back to its own pair (left_pair_id === selected_right_pair_id).
    const results = [];

    for (const answer of answers) {
      const isCorrect = answer.leftPairId === answer.selectedRightPairId;

      await DB.pool(
        `INSERT INTO dnd_match_user_answers
           (user_id, dnd_match_exercise_id, left_pair_id, selected_right_pair_id, is_correct)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, dnd_match_exercise_id, left_pair_id)
         DO UPDATE SET
           selected_right_pair_id = $4,
           is_correct = $5,
           updated_at = NOW()`,
        [
          userId,
          match_id,
          answer.leftPairId,
          answer.selectedRightPairId,
          isCorrect,
        ]
      );

      results.push({
        leftPairId: answer.leftPairId,
        selectedRightPairId: answer.selectedRightPairId,
        isCorrect,
      });
    }

    const correctCount = results.filter((r) => r.isCorrect).length;
    const allCorrect = correctCount === results.length;

    return NextResponse.json({
      results,
      allCorrect,
      correctCount,
      total: results.length,
    });
  } catch (error) {
    console.error("Error submitting dnd_match answers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
