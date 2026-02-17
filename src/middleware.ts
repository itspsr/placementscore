import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  
  // 1. Bypass check for cron/automated requests
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.next();
  }

  // 2. Otherwise, use next-auth's withAuth
  return (withAuth as any)(req, {
    callbacks: {
      authorized: ({ token }: { token: any }) => {
        return (
          token?.email === "admin@placementscore.online" ||
          token?.email === "itspsr@gmail.com" ||
          token?.name === "urboss"
        );
      },
    },
  });
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
