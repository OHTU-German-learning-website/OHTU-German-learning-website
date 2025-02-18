import { NextResponse } from "next/server";
import { deleteSession } from "../../../lib/session";
import { getConfig } from "../../../../backend/config";

export async function POST() {
  const config = getConfig();
  await deleteSession();
  return NextResponse.redirect(`${config.host}/auth/login`);
}
