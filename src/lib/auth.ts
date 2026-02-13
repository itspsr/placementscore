import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// Validation for Production Environment Variables
if (process.env.NODE_ENV === "production") {
  if (!process.env.NEXTAUTH_SECRET) {
    console.error("FATAL ERROR: NEXTAUTH_SECRET is missing in production environment.");
  }
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("FATAL ERROR: Google OAuth credentials (CLIENT_ID/SECRET) are missing.");
  }
}

export const authOptions: NextAuthOptions = {
  // Use environment variables directly with fallbacks for local development
  // In production, NextAuth will throw if these are missing
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  
  // REQUIRED: NextAuth secret for JWT encryption/hashing
  secret: process.env.NEXTAUTH_SECRET,
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user }) {
      // Logic for authentication gating can be added here
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on auth errors
  },

  // Security hardening
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};
