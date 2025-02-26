import { DB } from "../../../../backend/db";
import { hashPassword } from "@/backend/auth/hash";
import { emailRegex } from "@/shared/const";

export async function POST(request) {
  const json = await request.json();
  const email = json["email"].toLowerCase().trim();
  const password = json["password"];
  const { salt, hashedPassword } = await hashPassword(password);
  const existingUser = await DB.pool("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (existingUser.rows.length > 0) {
    return Response.json(
      { error: "Konto ist bereits vorhanden." },
      { status: 409 }
    );
  }
  if (email === "" || password === "") {
    return Response.json(
      { error: "E-Mail und Passwort sind erforderlich." },
      { status: 400 }
    );
  }
  if (emailRegex.test(email) === false) {
    return Response.json(
      { error: "Ungültige E-Mail-Adresse." },
      { status: 422 }
    );
  }
  if (password.length < 8 || password.length > 64) {
    return Response.json(
      { error: "Das Passwort muss mindestens 8 Zeichen lang sein." },
      { status: 422 }
    );
  }

  await DB.pool(
    "INSERT INTO users (email, password_hash, salt) VALUES ($1, $2, $3)",
    [email, hashedPassword, salt]
  );
  return Response.json({
    status: 200,
    message: "Account created.",
  });
}
