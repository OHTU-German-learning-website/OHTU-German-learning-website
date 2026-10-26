import { DB } from "../../../../backend/db";
import { hashPassword } from "@/backend/auth/hash";
import { emailRegex } from "@/shared/const";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
} from "node:crypto";
import { isIP } from "node:net";
import { getConfig } from "@/backend/config";

const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const CAPTCHA_FAILURE_LIMIT = 20;

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

async function getCaptchaCooldown(ipHash) {
  const result = await DB.pool(
    `SELECT GREATEST(1, CEIL(EXTRACT(EPOCH FROM (blocked_until - now()))))::int AS retry_after
     FROM registration_captcha_attempts
     WHERE ip_hash = $1 AND blocked_until > now()`,
    [ipHash]
  );

  return result.rows[0]?.retry_after ?? null;
}

async function recordCaptchaFailure(ipHash) {
  await DB.pool(
    `DELETE FROM registration_captcha_attempts
     WHERE updated_at < now() - interval '1 day'`
  );

  const result = await DB.pool(
    `INSERT INTO registration_captcha_attempts AS attempts
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
    [ipHash, CAPTCHA_FAILURE_LIMIT]
  );

  return result.rows[0];
}

function getCaptchaKey() {
  return createHash("sha256").update(getConfig().sessionSecret).digest();
}

function createCaptcha() {
  const left = randomBytes(1).readUInt8() % 10;
  const right = randomBytes(1).readUInt8() % 10;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getCaptchaKey(), iv);
  const payload = Buffer.from(
    JSON.stringify({
      answer: String(left + right),
      expiresAt: Date.now() + CAPTCHA_TTL_MS,
    })
  );
  const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
  const token = Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString(
    "base64url"
  );

  return { question: `Was ist ${left} + ${right}?`, token };
}

function isCaptchaAnswerValid(token, answer) {
  if (typeof token !== "string" || typeof answer !== "string") return false;

  try {
    const data = Buffer.from(token, "base64url");
    if (data.length < 29) return false;

    const decipher = createDecipheriv(
      "aes-256-gcm",
      getCaptchaKey(),
      data.subarray(0, 12)
    );
    decipher.setAuthTag(data.subarray(12, 28));
    const decrypted = Buffer.concat([
      decipher.update(data.subarray(28)),
      decipher.final(),
    ]);
    const payload = JSON.parse(decrypted.toString("utf8"));
    return (
      Number.isFinite(payload.expiresAt) &&
      payload.expiresAt > Date.now() &&
      answer.trim() === payload.answer
    );
  } catch {
    return false;
  }
}

export async function GET() {
  return Response.json(createCaptcha(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request) {
  const json = await request.json();
  const clientIp = getClientIp(request);
  const ipHash = clientIp ? hashClientIp(clientIp) : null;

  if (ipHash) {
    const retryAfter = await getCaptchaCooldown(ipHash);
    if (retryAfter) {
      return Response.json(
        {
          error:
            "Zu viele falsche CAPTCHA-Versuche. Bitte versuchen Sie es später erneut.",
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }
  }

  if (!isCaptchaAnswerValid(json.captchaToken, json.captchaAnswer)) {
    if (ipHash) {
      const attempt = await recordCaptchaFailure(ipHash);
      if (attempt.blocked_until) {
        const retryAfter = await getCaptchaCooldown(ipHash);
        return Response.json(
          {
            error:
              "Zu viele falsche CAPTCHA-Versuche. Bitte versuchen Sie es später erneut.",
          },
          {
            status: 429,
            headers: { "Retry-After": String(retryAfter ?? 900) },
          }
        );
      }
    }

    return Response.json(
      { error: "Bitte lösen Sie die CAPTCHA-Aufgabe korrekt." },
      { status: 422 }
    );
  }

  if (ipHash) {
    await DB.pool(
      "DELETE FROM registration_captcha_attempts WHERE ip_hash = $1",
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
  return Response.json({
    status: 200,
    message: "Account created.",
  });
}
