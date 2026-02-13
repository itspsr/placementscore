import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

const ALLOWED_ADMINS = ["admin@placementscore.online"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email && ALLOWED_ADMINS.includes(user.email)) {
        return true;
      }
      return false; // Deny access to everyone else
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/', // Redirect back to home for sign in or use default
    error: '/',  // Redirect to home on error
  }
};
