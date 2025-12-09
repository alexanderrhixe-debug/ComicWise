import { db } from "@/db/client";
import { passwordResetToken } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPasswordResetToken(token: string) {
  return await db.query.passwordResetToken.findFirst({
    where: eq(passwordResetToken.token, token),
  });
}

export async function getValidPasswordResetToken(token: string) {
  return await db.query.passwordResetToken.findFirst({
    where: eq(passwordResetToken.token, token),
  });
}

export async function getPasswordResetTokensByEmail(email: string) {
  return await db.query.passwordResetToken.findMany({
    where: eq(passwordResetToken.email, email),
  });
}
