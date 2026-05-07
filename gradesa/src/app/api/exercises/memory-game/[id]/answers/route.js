import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const POST = withAuth(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();
  const { matches } = body;
  const userId = request.user?.id;

  if (!id || Number.isNaN(Number(id)) || !Array.isArray(matches)) {
    return new Response(JSON.stringify({ error: "Ungültige Anfrage." }), {
      status: 400,
    });
  }

  try {
    const { rows: pairs } = await DB.pool(
      `SELECT left_item, right_item
       FROM memory_game_pairs
       WHERE memory_game_exercise_id = $1
       ORDER BY pair_order ASC`,
      [id]
    );

    if (pairs.length === 0) {
      return new Response(JSON.stringify({ error: "Übung nicht gefunden." }), {
        status: 404,
      });
    }

    const expectedSet = new Set(
      pairs.map((pair) => `${pair.left_item}|||${pair.right_item}`)
    );
    const correctCount = matches.reduce((count, match) => {
      if (
        match &&
        typeof match.left_item === "string" &&
        typeof match.right_item === "string" &&
        expectedSet.has(`${match.left_item}|||${match.right_item}`)
      ) {
        return count + 1;
      }
      return count;
    }, 0);

    const score = Math.round((correctCount / pairs.length) * 100);

    await DB.pool(
      `INSERT INTO memory_game_user_answers
         (user_id, memory_game_exercise_id, attempts, score, completed, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (user_id, memory_game_exercise_id)
       DO UPDATE SET
         attempts = EXCLUDED.attempts,
         score = EXCLUDED.score,
         completed = EXCLUDED.completed,
         updated_at = NOW()`,
      [
        userId,
        id,
        JSON.stringify(matches),
        score,
        correctCount === pairs.length,
      ]
    );

    return new Response(
      JSON.stringify({
        total: pairs.length,
        correctCount,
        score,
        perfect: correctCount === pairs.length,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error evaluating memory game answers:", error);
    return new Response(JSON.stringify({ error: "Interner Serverfehler." }), {
      status: 500,
    });
  }
});
