import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/shared/const";

// Paths only logged-in users can access
const authRequired = ["/lessons/exercises"];

// Restricted paths logged-in users cannot access
const unauthRequired = ["/auth/login", "/auth/register"];

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

  // Redirect logged-in users trying to access the restricted paths
  if (hasCookie && unauthRequired.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, allow the request to proceed and prevent caching of the response
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
