import { NextResponse } from "next/server";
import { deleteSession } from "@/backend/auth/session";

export async function POST() {
  await deleteSession();
  return NextResponse.json({ success: true });
}
