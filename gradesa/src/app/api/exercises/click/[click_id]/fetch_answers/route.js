import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  const { click_id } = params;
  const userId = request.user.id;

  if (!click_id || !userId) {
    return Response.json(
      { message: "Fehlende erforderliche Felder." },
      { status: 400 }
    );
  }

  const exercise = await DB.pool(
    "SELECT * FROM click_exercises WHERE id = $1",
    [click_id]
  );

  if (exercise.rows.length === 0) {
    return Response.json({ message: "Keine Übung gefunden." }, { status: 404 });
  }

  const { rows: userAnswerRows } = await DB.pool(
    `SELECT 
            selected_words, 
            target_words, 
            created_at, 
            updated_at
        FROM click_user_answers 
        WHERE click_exercise_id = $1 AND user_id = $2
        ORDER BY updated_at DESC`,
    [click_id, userId]
  );

  return Response.json({
    exercise: exercise.rows[0],
    userAnswers: userAnswerRows,
  });
});
