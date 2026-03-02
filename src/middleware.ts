import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const protectedPaths = ["/dashboard", "/admin"];
  const { pathname } = req.nextUrl;

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = req.cookies.get("sb-access-token");
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
