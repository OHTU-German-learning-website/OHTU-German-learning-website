import { NextResponse } from "next/server";
import { checkSession } from "@/backend/auth/session";

// Paths only logged-in users can access
const protectedPaths = ["/lessons/exercises/dragdrop"];

// Restricted paths logged-in users cannot access
const restrictedPaths = ["/auth/login", "/auth/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const userId = await checkSession();

  // Redirect logged-out users trying to access protected paths
  if (!userId && protectedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect logged-in users trying to access the restricted paths
  if (userId && restrictedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

// Combine all the routes where the middleware should run
export const config = {
  matcher: [...restrictedPaths, ...protectedPaths],
};
