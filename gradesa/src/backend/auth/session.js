"server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getConfig, isTest } from "../../backend/config";
import { AUTH_COOKIE_NAME } from "@/shared/const";

/**
 * Session management utilities using signed JWTs stored in HTTP-only cookies.
 *
 * - Secret and TTL come from `getConfig()` (`sessionSecret`, `sessionTTL`).
 * - JWTs are signed with HS256 and include `{ user, expiresAt }`.
 * - In tests (`isTest`), cookie operations are skipped; `checkSession` returns
 *   `request.testUser` when provided.
 */
const { sessionSecret, sessionTTL } = getConfig();
const encodedKey = new TextEncoder().encode(sessionSecret);

/**
 * Signs an arbitrary payload into a JWT using HS256 and configured TTL.
 *
 * @param {Record<string, any>} payload - Object to embed in the token.
 * @returns {Promise<string>} A compact JWT string.
 */
export async function signPayload(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(sessionTTL / 1000 + "s") // ms to s
    .sign(encodedKey);
}

/**
 * Verifies a JWT and returns its payload when valid.
 *
 * @param {string} session - Compact JWT string from the cookie.
 * @returns {Promise<Record<string, any> | undefined>} Payload if valid; otherwise `undefined`.
 */
export async function verifySession(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

/**
 * Creates a new session cookie for a user.
 *
 * Stores a signed JWT in `AUTH_COOKIE_NAME` with `httpOnly`, `sameSite:lax`,
 * and environment-appropriate `secure`. Skips cookie setting in tests.
 *
 * @param {{ id:number, username:string, email:string, is_admin:boolean }} user -
 *   Minimal user info to embed in the session.
 * @returns {Promise<void>} Resolves when the cookie is set (or skipped in tests).
 */
export async function createSession(user) {
  const expiresAt = new Date(Date.now() + sessionTTL);
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
    },
    expiresAt: expiresAt,
  };
  const session = await signPayload(payload);
  // Testing with happy-dom complains that this isn't called within the request
  // scope, can't fix it now so just return when testing.
  // If you need to test this functionality, mock the cookieStore.set call.
  if (isTest) {
    return void 0;
  }
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Reads the current session cookie and returns the embedded user.
 *
 * In tests, returns `request.testUser` to aid mocking.
 *
 * @param {Request & { testUser?: any }} [request] - Optional request object providing `testUser` in tests.
 * @returns {Promise<{ id:number, username:string, email:string, is_admin:boolean } | null>} The user or `null`.
 */
export async function checkSession(request) {
  if (isTest) {
    return request.testUser;
  }
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME);
  if (session) {
    const payload = await verifySession(session.value);
    if (payload) {
      return payload.user;
    }
  }
  return null;
}

/**
 * Deletes the current session cookie.
 * @returns {Promise<void>} Resolves when the cookie is removed.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
