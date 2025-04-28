import { DB } from "@/backend/db";

export async function POST(request, { params }) {
  const { click_id } = await params;
  const { user_id, selected_words, target_words } = await request.json();

  if (!click_id || !user_id || !selected_words || !target_words) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), {
      status: 400,
    });
  }

  try {
    await DB.pool(
      `INSERT INTO click_answers (user_id, click_exercise_id, answer, target_words, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [user_id, click_id, selected_words, target_words]
    );

    return new Response(
      JSON.stringify({ message: "Answers saved successfully." }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }
}
