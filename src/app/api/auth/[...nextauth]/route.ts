import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_ADMINS = ["admin@placementscore.online"];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      if (user.email && ALLOWED_ADMINS.includes(user.email)) {
        return true;
      }
      return false; // Deny access to everyone else
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/', // Redirect back to home for sign in or use default
    error: '/',  // Redirect to home on error
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
