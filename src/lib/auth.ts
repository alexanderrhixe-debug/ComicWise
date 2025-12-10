// keep auth options loosely typed here to avoid hard dependency on a specific Auth type
import bcrypt from "bcryptjs";
import { user } from "database/schema";
import type { Database } from "db";
import { db } from "db";
import { eq } from "drizzle-orm";
import createDrizzleAdapter from "lib/authAdapter";
import getOAuthProviders, { authOptions } from "lib/authConfig";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

// Helper to obtain typed auth options for use in app routes
export function getAuthOptions(): unknown {
  return authOptions as unknown;
}

export default getAuthOptions;

const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

const oauthProviders = getOAuthProviders();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: createDrizzleAdapter(db as unknown as Database),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/sign-in",
    newUser: "/register",
    signOut: "/sign-out",
    error: "/error",
    verifyRequest: "/verify-request",
  },
  providers: [
    // Credentials provider with DB-backed authorize
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>> | undefined) {
        try {
          const { email, password } = signInSchema.parse(credentials);

          const existingUser = await db.query.user.findFirst({
            where: eq(user.email, email),
          });

          if (!existingUser || !existingUser.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, existingUser.password);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            image: existingUser.image,
            role: existingUser.role,
          };
        } catch {
          return null;
        }
      },
    }),
    // Spread any OAuth providers (e.g. Google)
    ...oauthProviders,
  ],
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user?: any }) {
      if (user && (user as any).id) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: Record<string, unknown> }) {
      if (session.user && token.id) {
        session.user.role = token.role as "user" | "admin" | "moderator";
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
