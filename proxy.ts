import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("wishcube_access_token")?.value;

  // Protect /dashboard routes from unauthenticated users
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect /admin routes from unauthenticated users
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect /mystore routes from unauthenticated vendors
  if (request.nextUrl.pathname.startsWith("/mystore")) {
    if (!token) {
      return NextResponse.redirect(new URL("/vendor/login", request.url));
    }
  }

  return NextResponse.next();
}

// Config to match only the paths we want to protect
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/mystore/:path*"],
};
