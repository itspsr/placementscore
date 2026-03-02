import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// NOTE: This is a minimal config to satisfy server-session usage in API routes.
// Auth in this project is primarily handled via Supabase in the client.

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_URL || "placementscore" ,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize() {
        return null;
      }
    })
  ]
};
