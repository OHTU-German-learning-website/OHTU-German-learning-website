import { NextResponse } from "next/server";
import { createSession } from "../../../lib/session";
import { DB } from "@/backend/db";
import { scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function POST(request) {
  const { email, password } = await request.json();
  const errorMsg = "Ungültige E-Mail-Adresse oder Passwort";

  // Mock user credentials
  //const mockEmail = "user@example.com";
  //const mockPassword = "Demonstration1";

  //if (email !== mockEmail || password !== mockPassword) {
  //  return NextResponse.json(
  //    { error: "Ungültige E-Mail-Adresse oder Passwort" },
  //    { status: 401 }
  //  );
  //}

  // Perform DB query
  const userResult = await DB.pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  // If the user does not exist, return an error
  if (userResult.rowCount === 0) {
    return NextResponse.json({ error: errorMsg }, { status: 401 });
  }

  // If the user exists, assign it to the user variable
  const user = userResult.rows[0];

  // Extract salt from user object
  const salt = user.salt;

  // Hash and salt the input password
  const inputPasswordHash = (await scryptAsync(password, salt, 64)).toString(
    "hex"
  );

  // If the hashed password does not match the one stored in DB, return an error
  if (user.password_hash !== inputPasswordHash) {
    return NextResponse.json({ error: errorMsg }, { status: 401 });
  }

  // Create a session with the userId
  await createSession(user.id);

  return NextResponse.json({ message: "Login successful" });
}
