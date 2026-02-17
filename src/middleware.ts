import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 1. Allow if it's a cron/automated request with valid secret
        const authHeader = req.headers.get("authorization");
        if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
          return true;
        }

        // 2. Otherwise, check for admin session
        return (
          token?.email === "admin@placementscore.online" ||
          token?.email === "itspsr@gmail.com" ||
          token?.name === "urboss"
        );
      },
    },
  }
);

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
