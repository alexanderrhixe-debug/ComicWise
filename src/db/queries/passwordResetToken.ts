import { eq } from "drizzle-orm";

import { db } from "../client";
import { passwordResetToken } from "../schema";

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
