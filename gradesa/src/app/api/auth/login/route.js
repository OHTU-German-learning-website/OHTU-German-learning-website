import { NextResponse } from "next/server";
import { createSession } from "../../../lib/session";
import { DB } from "@/backend/db";
import { verifyPassWord } from "@/backend/auth/hash";

export async function POST(request) {
  const { email, password } = await request.json();
  const errorMsg = "Ungültige E-Mail-Adresse oder Passwort";

  // Perform DB query
  const userResult = await DB.pool("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  // If the user does not exist, return an error
  if (userResult.rowCount === 0) {
    return NextResponse.json({ error: errorMsg }, { status: 401 });
  }

  // If the user exists, assign it to the user variable
  const user = userResult.rows[0];

  // Extract salt from user object
  const salt = user.salt;

  // Verify user input password by hashing and salting it first
  const inputPasswordHash = await verifyPassWord(password, salt);

  // If the hashed password does not match the one stored in DB, return an error
  if (user.password_hash !== inputPasswordHash) {
    return NextResponse.json({ error: errorMsg }, { status: 401 });
  }

  // Create a session with the userId
  await createSession(user.id);

  return NextResponse.json({ message: "Login successful" });
}
