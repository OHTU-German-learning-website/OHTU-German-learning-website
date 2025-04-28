import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const POST = withAuth(async (request, { params }) => {
  const { click_id } = await params;
  const { selected_words, target_words } = await request.json();
  const user_id = request.user.id;

  if (!click_id || !user_id || !selected_words || !target_words) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), {
      status: 400,
    });
  }

  try {
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
      JSON.stringify({ message: "Answers saved successfully." }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error saving click exercise answers:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }
});
