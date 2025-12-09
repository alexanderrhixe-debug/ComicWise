import bcrypt from "bcryptjs";
import { user } from "database/schema";
import { db } from "db";
import { eq } from "drizzle-orm";
import createDrizzleAdapter from "lib/authAdapter";
import getOAuthProviders from "lib/authConfig";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

const oauthProviders = getOAuthProviders();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: createDrizzleAdapter(db) as any,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/(auth)/sign-in",
    signOut: "/",
    error: "/(auth)/sign-in",
    verifyRequest: "/(auth)/verify-request",
  },
  providers: [
    // Credentials provider with DB-backed authorize
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
    async jwt({ token, user }) {
      if (user && user.id) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.role = token.role as "user" | "admin" | "moderator";
        session.user.id = token.id;
      }
      return session;
    },
  },
});
