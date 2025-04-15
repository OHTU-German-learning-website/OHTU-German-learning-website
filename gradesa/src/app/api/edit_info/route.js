import { checkSession } from "@/backend/auth/session";

export const dynamic = "force-dynamic"; // Ensures it's server-executed always

export async function GET() {
  try {
    const user = await checkSession();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    return Response.json({ user });
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
