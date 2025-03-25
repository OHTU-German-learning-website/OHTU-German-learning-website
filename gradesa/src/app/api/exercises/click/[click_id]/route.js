import { DB } from "@/backend/db";

export async function GET(request, { params }) {
  const { click_id } = await params; // '1', '2', or '3' etc
  console.log(click_id);
  const exercise = await DB.pool(
    "SELECT * FROM click_exercises WHERE id = $1",
    [click_id]
  );
  return Response.json(exercise.rows);
}
