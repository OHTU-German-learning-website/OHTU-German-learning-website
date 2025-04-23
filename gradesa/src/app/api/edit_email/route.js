import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(
  async (req) => {
    const user = req.user;

    return Response.json(user, { status: 200 });
  },
  { requireAuth: true }
);
