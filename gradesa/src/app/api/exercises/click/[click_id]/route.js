import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  const { click_id } = await params; // '1', '2', or '3' etc
  const userId = request.user.id;

  if (!click_id || isNaN(parseInt(click_id, 10))) {
    return Response.json({ message: "Ungültige Übungs-ID." }, { status: 400 });
  }

  if (!userId) {
    return Response.json({ message: "Benutzer-ID fehlt." }, { status: 400 });
  }

  const exercise = await DB.pool(
    "SELECT * FROM click_exercises WHERE id = $1",
    [click_id]
  );

  if (exercise.rows.length === 0) {
    return Response.json({ message: "Keine Übung gefunden." }, { status: 404 });
  }

  try {
    const answer = await DB.pool(
      "SELECT answer FROM click_answers WHERE click_exercise_id = $1 AND user_id = $2",
      [click_id, userId]
    );

    if (answer.rows.length > 0) {
      // Return both exercise and userAnswers if userAnswers exist
      return Response.json(
        {
          exercise: exercise.rows[0],
          userAnswers: answer.rows[0],
        },
        { status: 200 }
      );
    }

    // Return only the exercise if no userAnswers exist
    return Response.json(
      {
        exercise: exercise.rows[0],
        userAnswers: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching exercise or answers:", error);
    return Response.json(
      { message: "Interner Serverfehler." },
      { status: 500 }
    );
  }
});
