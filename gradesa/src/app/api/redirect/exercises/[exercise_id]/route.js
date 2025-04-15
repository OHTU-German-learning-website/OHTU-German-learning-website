import { DB } from "@/backend/db";

export async function GET(request, { params }) {
  const { exercise_id } = await params;
  const baseUrl = request.url;

  if (!exercise_id || isNaN(parseInt(exercise_id, 10))) {
    return Response.json({ message: "Ungültige Übungs-ID." }, { status: 400 });
  }
  const category = await DB.pool(
    "SELECT category FROM exercises WHERE id = $1",
    [exercise_id]
  );
  if (category.rows.length === 0) {
    return Response.json({ message: "Keine Übung gefunden." }, { status: 404 });
  }
  if (category.rows[0].category === "click") {
    const click_id = await DB.pool(
      "SELECT click_id FROM click_to_exercises WHERE exercise_id = $1",
      [exercise_id]
    );
    return Response.redirect(
      new URL(`/grammar/exercises/click/${click_id.rows[0].click_id}`, baseUrl)
    );
  }
  if (category.rows[0].category === "freeform") {
    const free_form_id = await DB.pool(
      "SELECT id FROM free_form_exercises WHERE exercise_id = $1",
      [exercise_id]
    );
    console.log(free_form_id);
    return Response.redirect(
      new URL(
        `/grammar/exercises/free-form/${free_form_id.rows[0].id}`,
        baseUrl
      )
    );
  }
}
