import { NextResponse } from "next/server";
import { checkSession } from "@/backend/auth/session";

// Paths only logged-in users can access
const protectedPaths = ["/learning"]; // learning page selected for testing purposes

// Restricted paths logged-in users cannot access
const restrictedPaths = ["/auth/login", "/auth/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const userId = await checkSession();

  // Redirect logged-out users trying to access protected paths
  if (!userId && protectedPaths.includes(pathname)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // Add the original path as a query parameter
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users trying to access the restricted paths
  if (userId && restrictedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

// All the routes where the middleware should run
export const config = {
  matcher: ["/learning", "/auth/login", "/auth/register"],
};
