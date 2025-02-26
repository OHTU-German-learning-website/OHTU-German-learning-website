import { DB } from "../../../../backend/db";
import { hashPassword } from "@/backend/auth/hash";

export const emailRegex = new RegExp(
  `^([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])$`,
  "i"
);

export async function POST(request) {
  const json = await request.json();
  const email = json["email"];
  const password = json["password"];
  const { salt, hashedPassword } = await hashPassword(password);
  const existingUser = await DB.pool("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (existingUser.rows.length > 0) {
    return Response.json({ error: "Account already exists." }, { status: 409 });
  }
  if (email === "" || password === "") {
    return Response.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }
  if (emailRegex.test(email) === false) {
    return Response.json({ error: "Invalid email address." }, { status: 422 });
  }
  if (password.length < 8 || password.length > 64) {
    return Response.json(
      { error: "Password must be at least 8 characters long." },
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
