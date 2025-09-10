"server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getConfig, isTest } from "../../backend/config";
import { AUTH_COOKIE_NAME } from "@/shared/const";

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
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

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

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
