
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
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
