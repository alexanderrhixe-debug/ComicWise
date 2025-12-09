import { db } from "@/db/client";
import { verificationToken } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// VERIFICATION TOKEN MUTATIONS
// ═══════════════════════════════════════════════════

export async function createVerificationToken(data: {
  identifier: string;
  token: string;
  expires: Date;
}) {
  const [newToken] = await db.insert(verificationToken).values(data).returning();
  return newToken;
}

export async function deleteVerificationToken(identifier: string, token: string) {
  const [deletedToken] = await db
    .delete(verificationToken)
    .where(and(eq(verificationToken.identifier, identifier), eq(verificationToken.token, token)))
    .returning();
  return deletedToken;
}

export async function deleteVerificationTokensByIdentifier(identifier: string) {
  return await db
    .delete(verificationToken)
    .where(eq(verificationToken.identifier, identifier))
    .returning();
}

export async function deleteExpiredVerificationTokens() {
  const now = new Date();
  return await db.delete(verificationToken).where(lt(verificationToken.expires, now)).returning();
}
