import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  try {
    const { match_id } = await params;

    if (!match_id || isNaN(parseInt(match_id, 10))) {
      return NextResponse.json(
        { error: "Ungültige Übungs-ID." },
        { status: 400 }
      );
    }

    const { rows: exerciseRows } = await DB.pool(
      `SELECT dme.id, dme.title, dme.description, e.created_at
       FROM dnd_match_exercises dme
       JOIN exercises e ON dme.exercise_id = e.id
       WHERE dme.id = $1`,
      [match_id]
    );

    if (exerciseRows.length === 0) {
      return NextResponse.json(
        { error: "Übung nicht gefunden." },
        { status: 404 }
      );
    }

    // Pairs ordered by pair_order → fixed left column
    const { rows: pairs } = await DB.pool(
      `SELECT id, left_item, right_item, pair_order
       FROM dnd_match_pairs
       WHERE dnd_match_exercise_id = $1
       ORDER BY pair_order ASC`,
      [match_id]
    );

    // Left items keep their order; right items are the same rows shuffled
    const leftItems = pairs.map((p) => ({
      id: p.id,
      text: p.left_item,
      order: p.pair_order,
    }));

    // Shuffle right items (Fisher-Yates) so the order differs from the left column
    const rightItems = pairs.map((p) => ({ id: p.id, text: p.right_item }));
    for (let i = rightItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
    }

    // Previous answers for this user (empty when first visit)
    const userId = request.user.id;
    const { rows: userAnswers } = await DB.pool(
      `SELECT left_pair_id, selected_right_pair_id, is_correct
       FROM dnd_match_user_answers
       WHERE user_id = $1 AND dnd_match_exercise_id = $2`,
      [userId, match_id]
    );

    return NextResponse.json({
      ...exerciseRows[0],
      leftItems,
      rightItems,
      userAnswers,
    });
  } catch (error) {
    console.error("Error fetching dnd_match exercise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
