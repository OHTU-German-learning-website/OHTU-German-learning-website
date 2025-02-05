import { DB } from "../../../backend/db";

export async function GET(request) {
  const result = await DB.pool("SELECT now()");
  const query = request.nextUrl.searchParams;
  const mode = query.get("mode");
  if (mode === "error") {
    return Response.json({ message: "Error" }, { status: 500 });
  }
  const now = result.rows[0].now;
  return Response.json({ message: "Hello!", now, mode });
}
