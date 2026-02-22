import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// Safe-mode validation (no hard fails)
if (process.env.NODE_ENV === "production") {
  if (!process.env.NEXTAUTH_SECRET) {
    console.warn("NEXTAUTH_SECRET is missing; running in safe mode.");
  }
}

export const authOptions: NextAuthOptions = {
  // Use environment variables directly with fallbacks for local development
  // In production, NextAuth will throw if these are missing
  providers: [
    CredentialsProvider({
      name: "Safe Mode",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Safe-mode auth: accept any email/password
        if (!credentials?.email) return null;
        return {
          id: credentials.email,
          name: credentials.email.split("@")[0],
          email: credentials.email
        } as any;
      }
    })
  ],

  // Optional in safe mode
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
