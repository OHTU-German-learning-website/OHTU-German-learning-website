import { DB } from "../../../backend/db";

export async function POST(request) {
  const json = await request.json();
  const email = json["email"];
  const password = json["password"];
  const existingUser = await DB.pool("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (existingUser.rows.length > 0) {
    return Response.json({ message: "Account already exists.", status: 400 });
  }

  await DB.pool("INSERT INTO users (email, password_hash) VALUES ($1, $2)", [
    email,
    password,
  ]);
  return Response.json({
    status: 200,
    message: "Account created.",
  });
}
