import { NextResponse } from "next/server";
import { deleteSession } from "@/backend/auth/session";
import { getConfig } from "@/backend/config";

export async function POST() {
  //const config = getConfig();
  await deleteSession();
  //const response = NextResponse.redirect(`${config.url}/`);
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", "session=; Max-Age=0; Path=/; HttpOnly");
  return response;
}
