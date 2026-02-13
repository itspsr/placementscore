import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Only allow if the email matches the admin email
      return token?.email === "admin@placementscore.online";
    },
  },
});

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
