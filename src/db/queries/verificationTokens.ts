import { and, eq, gt } from "drizzle-orm";

import { db } from "../client";
import { verificationToken } from "../schema";

// ═══════════════════════════════════════════════════
// VERIFICATION TOKEN QUERIES
// ═══════════════════════════════════════════════════

export async function getVerificationToken(identifier: string, token: string) {
  return await db.query.verificationToken.findFirst({
    where: and(eq(verificationToken.identifier, identifier), eq(verificationToken.token, token)),
  });
}

export async function getValidVerificationToken(identifier: string, token: string) {
  const now = new Date();
  return await db.query.verificationToken.findFirst({
    where: and(
      eq(verificationToken.identifier, identifier),
      eq(verificationToken.token, token),
      gt(verificationToken.expires, now)
    ),
  });
}

export async function getVerificationTokensByIdentifier(identifier: string) {
  return await db.query.verificationToken.findMany({
    where: eq(verificationToken.identifier, identifier),
  });
}
