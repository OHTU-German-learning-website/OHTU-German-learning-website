import { NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/session";
import { getConfig } from "@/backend/config";

export async function POST(request) {
  const config = getConfig();
  await deleteSession();
  const { headers } = request;
  console.log(headers);
  const origin = headers.get("origin");
  return NextResponse.redirect(`${config.host}/auth/login`);
}
