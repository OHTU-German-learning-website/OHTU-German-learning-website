import { NextResponse } from "next/server";
import { createSession } from "@/backend/auth/session";
import { DB } from "@/backend/db";
import { verifyPassWord } from "@/backend/auth/hash";

export async function POST(request) {
  const { identifier, password } = await request.json();
  const errorMsg = "Ungültige Benutzername/E-Mail-Adresse oder Passwort";

  // Perform DB query
  let userResult = await DB.pool("SELECT * FROM users WHERE email = $1", [
    identifier,
  ]);

  // If the user does not exist, return an error
  if (userResult.rowCount === 0) {
    userResult = await DB.pool("SELECT * FROM users WHERE username = $1", [
      identifier,
    ]);
    if (userResult.rowCount === 0) {
      return NextResponse.json({ error: errorMsg }, { status: 401 });
    }
  }

  // If the user exists, assign it to the user variable
  const user = userResult.rows[0];

  // Extract salt from user object
  const salt = user.salt;

  // Verify user input password by hashing and salting it and comparing it to the hashed password in the DB
  const passwordValid = await verifyPassWord(
    password,
    salt,
    user.password_hash
  );

  // If the hashed password does not match the one stored in DB, return an error
  if (!passwordValid) {
    return NextResponse.json({ error: errorMsg }, { status: 401 });
  }

  // Create a session with the userId
  await createSession(user.id);

  return NextResponse.json({ message: "Login successful" });
}
