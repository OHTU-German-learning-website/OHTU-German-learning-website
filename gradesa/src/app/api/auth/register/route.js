import { DB } from "../../../../backend/db";
import { hash_password, salt } from "../../../../backend/auth/hash";

export const emailRegex = new RegExp(
  `^([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])$`,
  "i"
);

export async function POST(request) {
  const json = await request.json();
  const email = json["email"];
  const password = json["password"];
  //  const salt = randomBytes(16).toString("hex");
  //  const hash_password = await new Promise((resolve, reject) => {
  //    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
  //      if (err) reject(err);
  //      resolve(derivedKey.toString("hex"));
  //   });
  //  });
  const existingUser = await DB.pool("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (existingUser.rows.length > 0) {
    return Response.json(
      { message: "Account already exists." },
      { status: 409 }
    );
  }
  if (email === "" || password === "") {
    return Response.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }
  if (emailRegex.test(email) === false) {
    return Response.json(
      { message: "Invalid email address." },
      { status: 422 }
    );
  }
  if (password.length < 8 || password.length > 64) {
    return Response.json(
      { message: "Password must be at least 8 characters long." },
      { status: 422 }
    );
  }

  await DB.pool(
    "INSERT INTO users (email, password_hash, salt) VALUES ($1, $2, $3)",
    [email, hash_password, salt]
  );
  return Response.json({
    status: 200,
    message: "Account created.",
  });
}
