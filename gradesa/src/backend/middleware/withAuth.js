import { NextResponse } from "next/server";
import { checkSession } from "@/backend/auth/session";

/**
 * Wraps a Next.js Route Handler with authentication/authorization checks.
 *
 * Usage examples appear in `src/backend/middleware/README.md` and various
 * API routes (e.g., `src/app/api/.../route.js`).
 *
 * Behavior:
 * - Reads the current user via `checkSession(request)`.
 * - If `requireAuth` is true and no user, responds `401 Unauthorized`.
 * - If `requireAdmin` is true and user is not admin, responds `401 Unauthorized`.
 * - Otherwise attaches `request.user` and invokes `callback(request, ...args)`.
 *
 * @param {(request: Request, ...args: any[]) => Promise<Response>|Response} callback -
 *   The original handler to execute when checks pass.
 * @param {{ requireAuth?: boolean, requireAdmin?: boolean }} [options] -
 *   Control whether authentication and/or admin rights are required.
 * @returns {(request: Request, ...args: any[]) => Promise<Response>} A wrapped handler.
 */
export function withAuth(callback, options = {}) {
  const { requireAuth = true, requireAdmin = false } = options;
  return async (request, ...args) => {
    const user = await checkSession(request);

    if (!user && requireAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (requireAdmin && !user?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    request.user = user;
    return await callback(request, ...args);
  };
}
