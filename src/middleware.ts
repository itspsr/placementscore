
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return NextResponse.next();
  }

  // @ts-ignore
  return (withAuth as any)(req, {
    callbacks: {
      authorized: ({ token }: { token: any }) => {
        return (
          token?.email === "admin@placementscore.online" ||
          token?.email === "itspsr@gmail.com"
        );
      },
    },
  });
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
