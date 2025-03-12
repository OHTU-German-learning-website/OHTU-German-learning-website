"server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getConfig, isTest } from "../../backend/config";

const { sessionSecret, sessionTTL } = getConfig();
const encodedKey = new TextEncoder().encode(sessionSecret);

export async function signPayload(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(sessionTTL / 1000 + "s") // ms to s
    .sign(encodedKey);
}

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

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + sessionTTL);
  const session = await signPayload({ userId, expiresAt });
  // Testing with happy-dom complains that this isn't called within the request
  // scope, can't fix it now so just return when testing.
  // If you need to test this functionality, mock the cookieStore.set call.
  if (isTest) {
    return void 0;
  }
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function checkSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (session) {
    const payload = await verifySession(session.value);
    if (payload) {
      return payload.userId;
    }
  }
  return null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
