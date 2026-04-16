import { getPageList } from "@/backend/html-services";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { type } = await params;
  const pages = await getPageList(type);

  return new Response(JSON.stringify({ pages }), {
    headers: { "Content-Type": "application/json" },
  });
}
