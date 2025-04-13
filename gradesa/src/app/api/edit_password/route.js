import { hashPassword, verifyPassword } from "@/backend/auth/hash";
import { DB } from "@/backend/db";
import { checkSession } from "@/backend/auth/session";

export async function POST(req) {
  const { currentPassword, newPassword } = await req.json();

  const user = await checkSession();
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const result = await DB.pool(
    `SELECT id, password_hash, salt FROM users WHERE id = $1`,
    [user.id]
  );

  const dbUser = result.rows[0];

  if (!dbUser || !dbUser.password_hash) {
    return new Response(JSON.stringify({ message: "Invalid user data" }), {
      status: 500,
    });
  }

  const isValid = await verifyPassword(
    currentPassword,
    dbUser.salt,
    dbUser.password_hash
  );

  if (!isValid) {
    return new Response(
      JSON.stringify({ message: "Incorrect current password" }),
      { status: 400 }
    );
  }

  const { salt, hashedPassword } = await hashPassword(newPassword);

  await DB.pool(
    `UPDATE users SET password_hash = $1, salt = $2 WHERE id = $3`,
    [hashedPassword, salt, user.id]
  );

  return new Response(JSON.stringify({ message: "Password updated" }), {
    status: 200,
  });
}
