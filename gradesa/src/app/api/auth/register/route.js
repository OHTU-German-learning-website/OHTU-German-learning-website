import { DB } from "../../../../backend/db";
import { hashPassword } from "@/backend/auth/hash";
import { emailRegex } from "@/shared/const";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { getConfig } from "@/backend/config";

const HONEYPOT_FAILURE_LIMIT = 20;

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const candidate =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim();

  return candidate && isIP(candidate) ? candidate : null;
}

function hashClientIp(ip) {
  return createHmac("sha256", getConfig().sessionSecret)
    .update(ip)
    .digest("hex");
}

async function getHoneypotCooldown(ipHash) {
  const result = await DB.pool(
    `SELECT GREATEST(1, CEIL(EXTRACT(EPOCH FROM (blocked_until - now()))))::int AS retry_after
     FROM registration_honeypot_attempts
     WHERE ip_hash = $1 AND blocked_until > now()`,
    [ipHash]
  );

  return result.rows[0]?.retry_after ?? null;
}

async function recordHoneypotSubmission(ipHash) {
  await DB.pool(
    `DELETE FROM registration_honeypot_attempts
     WHERE updated_at < now() - interval '1 day'`
  );

  const result = await DB.pool(
    `INSERT INTO registration_honeypot_attempts AS attempts
       (ip_hash, window_started_at, failed_attempts, blocked_until, updated_at)
     VALUES ($1, now(), 1, NULL, now())
     ON CONFLICT (ip_hash) DO UPDATE SET
       window_started_at = CASE
         WHEN attempts.window_started_at <= now() - interval '15 minutes' THEN now()
         ELSE attempts.window_started_at
       END,
       failed_attempts = CASE
         WHEN attempts.window_started_at <= now() - interval '15 minutes' THEN 1
         ELSE attempts.failed_attempts + 1
       END,
       blocked_until = CASE
         WHEN attempts.blocked_until > now() THEN attempts.blocked_until
         WHEN (CASE
           WHEN attempts.window_started_at <= now() - interval '15 minutes' THEN 1
           ELSE attempts.failed_attempts + 1
         END) >= $2 THEN now() + interval '15 minutes'
         ELSE NULL
       END,
       updated_at = now()
     RETURNING failed_attempts, blocked_until`,
    [ipHash, HONEYPOT_FAILURE_LIMIT]
  );

  return result.rows[0];
}

function registrationSuccessResponse() {
  return Response.json({ status: 200, message: "Account created." });
}

export async function POST(request) {
  const json = await request.json();
  const clientIp = getClientIp(request);
  const ipHash = clientIp ? hashClientIp(clientIp) : null;

  if (
    json.website !== undefined &&
    json.website !== null &&
    (typeof json.website !== "string" || json.website.trim())
  ) {
    if (ipHash && !(await getHoneypotCooldown(ipHash))) {
      await recordHoneypotSubmission(ipHash);
    }

    return registrationSuccessResponse();
  }

  if (ipHash) {
    await DB.pool(
      "DELETE FROM registration_honeypot_attempts WHERE ip_hash = $1",
      [ipHash]
    );
  }

  const email = json["email"].toLowerCase().trim();
  const password = json["password"];
  const username = json["username"];
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
  if (email === "" || password === "" || username === "") {
    return Response.json(
      { error: "E-Mail, Benutzername und Passwort sind erforderlich." },
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
  if (username.length < 3 || username.length > 20) {
    return Response.json(
      { error: "Der Benutzername muss zwischen 3 und 20 Zeichen lang sein." },
      { status: 422 }
    );
  }

  await DB.pool(
    "INSERT INTO users (email, password_hash, salt, username) VALUES ($1, $2, $3, $4)",
    [email, hashedPassword, salt, username]
  );
  return registrationSuccessResponse();
}
