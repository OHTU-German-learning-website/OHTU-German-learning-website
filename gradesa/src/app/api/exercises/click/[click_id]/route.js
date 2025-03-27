import { DB } from "@/backend/db";

export async function GET(request, { params }) {
  const { click_id } = await params; // '1', '2', or '3' etc

  if (!click_id || isNaN(parseInt(click_id, 10))) {
    return Response.json({ message: "Ungültige Übungs-ID." }, { status: 400 });
  }

  const exercise = await DB.pool(
    "SELECT * FROM click_exercises WHERE id = $1",
    [click_id]
  );

  if (exercise.rows.length === 0) {
    return Response.json({ message: "Keine Übung gefunden." }, { status: 404 });
  }

  return Response.json(exercise.rows[0]);
}
