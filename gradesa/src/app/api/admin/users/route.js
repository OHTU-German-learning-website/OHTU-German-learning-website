import { withAuth } from "@/backend/middleware/withAuth";
import { DB } from "@/backend/db";
import { NextResponse } from "next/server";

/**
 * Admin user management API.
 *
 * This route is intentionally restricted to superadmins only.
 * Even though `withAuth` already enforces authenticated admin access,
 * this route adds an additional `is_superadmin` check because ordinary
 * teachers/admins must not be able to access user management.
 */

/**
 * GET /api/admin/users
 *
 * Returns a list of all registered users with their current role flags.
 * Used by the `/admin/users` page to render the user management view.
 */

export const GET = withAuth(
  async (req) => {
    // Only superadmins are allowed to view the user management list.
    if (!req.user?.is_superadmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await DB.pool(
      `
            SELECT id, username, email, is_admin, is_superadmin
            FROM users
            ORDER BY id ASC
        `
    );

    return NextResponse.json(users.rows);
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

/**
 * PATCH /api/admin/users
 *
 * Updates the teacher/admin status of a user.
 *
 * Current behavior:
 * - `is_admin = true`  => teacher/admin-level access
 * - `is_admin = false` => student-level access
 *
 * Note:
 * `is_superadmin` is not modified here on purpose. Superadmin assignment
 * should remain a separate, more controlled action.
 */
export const PATCH = withAuth(
  async (req) => {
    // Only superadmins are allowed to change user roles.
    if (!req.user?.is_superadmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const body = await req.json();
      const { id, is_admin } = body;

      // Validate required input before touching the database.
      if (!id || typeof is_admin !== "boolean") {
        return NextResponse.json(
          { error: "User id and is_admin are required" },
          { status: 400 }
        );
      }

      const result = await DB.pool(
        `
        UPDATE users
        SET is_admin = $1
        WHERE id = $2
        RETURNING id, username, email, is_admin, is_superadmin
        `,
        [is_admin, id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating user role:", error);
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
