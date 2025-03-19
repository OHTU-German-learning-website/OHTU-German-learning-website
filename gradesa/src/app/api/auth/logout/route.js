import { NextResponse } from "next/server";
import { deleteSession } from "@/backend/auth/session";

export async function POST() {
  await deleteSession();
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", "session=; Max-Age=0; Path=/; HttpOnly");
  return response;
}
