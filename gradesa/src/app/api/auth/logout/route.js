import { NextResponse } from "next/server";
import { deleteSession } from "../../../lib/session";
import { getConfig } from "../../../../backend/config";

export async function POST() {
  const config = getConfig();
  await deleteSession();
  const response = NextResponse.redirect(`${config.url}/auth/login`);
  response.headers.set("Set-Cookie", "session=; Max-Age=0; Path=/; HttpOnly");
  return response;
}
