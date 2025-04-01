import { NextResponse } from "next/server";
import { checkSession } from "@/backend/auth/session";

export async function GET() {
  const user = await checkSession();
  if (user) {
    return NextResponse.json({ loggedIn: true, user });
  } else {
    return NextResponse.json(
      { loggedIn: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}
