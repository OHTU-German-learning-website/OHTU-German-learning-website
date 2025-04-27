import { withAuth } from "@/backend/middleware/withAuth";
import { DB } from "@/backend/db";
import { deleteSession, createSession } from "@/backend/auth/session";

export const GET = withAuth(
  async (req) => {
    const user = req.user;
    return Response.json(user, { status: 200 });
  },
  { requireAuth: true }
);

export const POST = withAuth(
  async (req) => {
    const { newEmail } = await req.json();
    const user = req.user;

    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return Response.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (newEmail === user.email) {
      return Response.json(
        { message: "New email must be different from current email" },
        { status: 400 }
      );
    }

    const existingUser = await DB.pool(
      `SELECT id FROM users WHERE email = $1 AND id != $2`,
      [newEmail, user.id]
    );

    if (existingUser.rows.length > 0) {
      return Response.json(
        { message: "This email is already in use by another account" },
        { status: 409 }
      );
    }

    try {
      await DB.pool(`UPDATE users SET email = $1 WHERE id = $2`, [
        newEmail,
        user.id,
      ]);

      const updatedUser = await DB.pool(
        `SELECT id, username, email, is_admin FROM users WHERE id = $1`,
        [user.id]
      );

      if (updatedUser.rows.length === 0) {
        throw new Error("User not found after update");
      }

      await deleteSession();

      const newUserData = {
        ...updatedUser.rows[0],
      };
      await createSession(newUserData);

      return Response.json(
        { message: "Email updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating email:", error);
      return Response.json(
        { message: "Failed to update email" },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
