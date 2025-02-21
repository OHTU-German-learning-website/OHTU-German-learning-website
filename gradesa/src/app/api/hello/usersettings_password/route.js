import { DB } from "../../../backend/db";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function POST(request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Email and new password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const salt = randomBytes(16).toString("hex");

    const hashedBuffer = await scryptAsync(newPassword, salt, 32);
    const hashed_password = `${salt}:${hashedBuffer.toString("hex")}`;

    const result = await DB.pool(
      "UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING *",
      [hashed_password, email]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error updating the password", err);
    return new Response(
      JSON.stringify({ error: "Failed to updatea the password" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
