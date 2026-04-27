import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const POST = withAuth(async (request, { params }) => {
  const { click_id } = await params;
  const { selected_words } = await request.json();
  const user_id = request.user.id;

  if (!click_id || !user_id || !selected_words) {
    return new Response(
      JSON.stringify({ error: "Fehlende erforderliche Felder." }),
      {
        status: 400,
      }
    );
  }

  try {
    const userResult = await DB.pool("SELECT 1 FROM users WHERE id = $1", [
      user_id,
    ]);

    if (userResult.rowCount === 0) {
      return new Response(
        JSON.stringify({ error: "Sitzung ungültig. Bitte erneut anmelden." }),
        {
          status: 401,
        }
      );
    }

    // Look up target_words from the exercise (authoritative source, satisfies FK constraint).
    const exerciseResult = await DB.pool(
      "SELECT target_words FROM click_exercises WHERE id = $1",
      [click_id]
    );

    if (exerciseResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Übung nicht gefunden." }), {
        status: 404,
      });
    }

    const target_words = exerciseResult.rows[0].target_words;

    await DB.pool(
      `INSERT INTO click_answers (user_id, click_exercise_id, answer, target_words, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (user_id, click_exercise_id)
       DO UPDATE SET 
         answer = $3, 
         target_words = $4, 
         updated_at = NOW()`,
      [user_id, click_id, selected_words, target_words]
    );

    return new Response(
      JSON.stringify({ message: "Antworten erfolgreich gespeichert." }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error saving click answers:", error);
    return new Response(JSON.stringify({ error: "Interner Serverfehler." }), {
      status: 500,
    });
  }
});
