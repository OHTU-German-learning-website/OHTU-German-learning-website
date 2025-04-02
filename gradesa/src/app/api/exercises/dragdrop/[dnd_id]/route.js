import { DB } from "@/backend/db";

export async function GET(request, { params }) {
  const { dnd_id } = await params; // '1', '2', or '3' etc

  if (!dnd_id || isNaN(parseInt(dnd_id, 10))) {
    return Response.json({ message: "Ungültige Übungs-ID." }, { status: 400 });
  }

  const exercise = await DB.pool("SELECT * FROM dnd_exercises WHERE id = $1", [
    dnd_id,
  ]);

  if (exercise.rows.length === 0) {
    return Response.json({ message: "Keine Übung gefunden." }, { status: 404 });
  }

  return Response.json(exercise.rows[0]);
}
