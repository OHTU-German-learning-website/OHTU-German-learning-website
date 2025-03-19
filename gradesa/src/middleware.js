import { NextResponse } from "next/server";

// Paths only logged-in users can access
const protectedPaths = ["/learning"]; // learning page selected for testing purposes

// Restricted paths logged-in users cannot access
const restrictedPaths = ["/auth/login", "/auth/register"];

const AUTH_COOKIE_NAME = "session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const hasCookie = !!sessionCookie && sessionCookie.value !== "";

  // Redirect logged-out users trying to access protected paths
  if (!hasCookie && protectedPaths.includes(pathname)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // Add the original path as a query parameter
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users trying to access the restricted paths
  if (hasCookie && restrictedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, allow the request to proceed and prevent caching of the response
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return response;
}

// All the routes where the middleware should run
export const config = {
  matcher: ["/learning", "/auth/login", "/auth/register"],
};
