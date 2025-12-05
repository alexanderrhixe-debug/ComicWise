import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

import { db } from "@/db";
import { account, authenticator, session, user, verificationToken } from "@/db/schema";
import { env } from "app-config";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
    authenticatorsTable: authenticator,
  }),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/",
    error: "/sign-in",
    verifyRequest: "/verify-request",
  },
  providers: [
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
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
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
