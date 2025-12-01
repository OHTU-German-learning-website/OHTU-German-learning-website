import { getPageList } from "@/backend/html-services";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { type } = await params;
  const pages = await getPageList(type);

  if (pages.length === 0) {
    return new NextResponse("not found", { status: 404 });
  }

  return new Response(JSON.stringify({ pages }), {
    headers: { "Content-Type": "application/json" },
  });
}
