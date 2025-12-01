import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/shared/const";

// Paths only logged-in users can access
/**
 * authRequired - array of path prefixes that require an authenticated
 * session (users without a valid session cookie will be redirected
 * to the login page when attempting to access these paths).
 * @type {string[]}
 */
const authRequired = ["/grammar/exercises", "/edit_info"];

// Restricted paths logged-in users cannot access
/**
 * unauthRequired - array of path prefixes that should not be accessible
 * to already authenticated users (e.g. login/register pages).
 * @type {string[]}
 */
const unauthRequired = ["/auth/login", "/auth/register"];

/**
 * middleware - Next.js middleware that protects certain routes by
 * checking for an authentication cookie. If a user without a valid
 * session attempts to access a protected path they are redirected to
 * the login page and the original path is provided as a `redirect`
 * query parameter. Responses are marked non-cacheable.
 *
 * @param {import('next/server').NextRequest} request
 * @returns {import('next/server').NextResponse}
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const hasCookie = !!sessionCookie && sessionCookie.value !== "";

  // Redirect logged-out users trying to access protected paths
  if (!hasCookie && authRequired.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // Add the original path as a query parameter
    return NextResponse.redirect(loginUrl);
  }
  // Otherwise, allow the request to proceed and prevent caching of the response
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return response;
}

/**
 * config - Next.js middleware configuration. The `matcher` controls which
 * paths the middleware runs for; this pattern excludes API routes, Next
 * internals and common static files.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
