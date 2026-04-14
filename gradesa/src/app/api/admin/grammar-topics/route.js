import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { NextResponse } from "next/server";

export const GET = withAuth(
  async () => {
    const result = await DB.pool(
      "SELECT id, name, sort_order FROM grammar_topics ORDER BY sort_order ASC NULLS LAST, LOWER(name) ASC"
    );
    return NextResponse.json(result.rows);
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
