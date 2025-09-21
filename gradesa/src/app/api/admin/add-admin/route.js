import { withAuth } from "@/backend/middleware/withAuth";
import { DB } from "@/backend/db";
import { NextResponse } from "next/server";

export const POST = withAuth(
  async (req) => {
    const body = await req.json();
    const { email } = body;

    // Check first if a user can be found with the email adress given:

    const userResult = await DB.pool(
      `
        SELECT id FROM users
        WHERE email = $1
        `,
      [email]
    );

    // If not, return an error message

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Ein Benutzer mit dieser E-Mail-Adresse existiert nicht." },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id;

    // Below the user should be updated to an admin:

    await DB.transaction(async (tx) => {
      await tx.query(
        `
        UPDATE users SET is_admin = true
        WHERE id = $1
        `,
        [userId]
      );
    });

    return NextResponse.json(
      {
        success: true,
        message: "Benutzer erfolgreich als administrator hinzugefügt",
      },
      { status: 200 }
    );
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
