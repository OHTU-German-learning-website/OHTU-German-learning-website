api / auth / logout / route.js;

import { NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/session";

export async function POST(request) {
  await deleteSession();
  const { headers } = request;
  const origin = headers.get("origin");
  return NextResponse.redirect(`${origin}/auth/login`);
}
