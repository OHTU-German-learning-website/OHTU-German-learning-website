import { NextResponse } from "next/server";
import { checkSession } from "@/backend/auth/session";

const restrictedPaths = ["/auth/login", "/auth/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const userId = await checkSession();

  // Redirect logged-in users trying to access the restricted paths
  if (userId && restrictedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
  matcher: restrictedPaths,
};
