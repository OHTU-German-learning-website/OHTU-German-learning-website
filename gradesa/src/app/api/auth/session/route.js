import { NextResponse } from "next/server";
import { checkSession } from "@/backend/auth/session";

export async function GET() {
  const userId = await checkSession();
  if (userId) {
    return NextResponse.json({ loggedIn: true, userId });
  } else {
    return NextResponse.json({ loggedIn: false });
  }
}
