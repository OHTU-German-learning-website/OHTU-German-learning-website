import { withAuth } from "@/backend/middleware/withAuth";
import { DB } from "@/backend/db";
import { NextResponse } from "next/server";

export const POST = withAuth(
  async (req) => {
    const body = await req.json();
    const { email } = body;

    const entryId = await DB.transaction(async (tx) => {
      const result = await tx.query(
        `
        UPDATE users SET is_admin = true
        WHERE email = $1
        `,
        [email]
      );
    });

    return NextResponse.json({ success: true });
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
