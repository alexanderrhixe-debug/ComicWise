import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { passwordResetToken } from "@/db/schema";

export async function createPasswordResetToken(data: {
  email: string;
  token: string;
  expires: Date;
}) {
  const [newToken] = await db
    .insert(passwordResetToken)
    .values({
      email: data.email,
      token: data.token,
      expires: data.expires,
    })
    .returning();
  return newToken;
}

export async function deletePasswordResetToken(token: string) {
  const [deletedToken] = await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.token, token))
    .returning();
  return deletedToken;
}

export async function deletePasswordResetTokensByEmail(email: string) {
  const deletedTokens = await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.email, email))
    .returning();
  return deletedTokens;
}
