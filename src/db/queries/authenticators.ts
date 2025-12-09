import { db } from "@/db/client";
import { authenticator } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// AUTHENTICATOR QUERIES
// ═══════════════════════════════════════════════════

export async function getAuthenticatorByCredentialId(credentialID: string) {
  return await db.query.authenticator.findFirst({
    where: eq(authenticator.credentialID, credentialID),
  });
}

export async function getAuthenticatorsByUserId(userId: string) {
  return await db.query.authenticator.findMany({
    where: eq(authenticator.userId, userId),
  });
}

export async function getAuthenticator(userId: string, credentialID: string) {
  return await db.query.authenticator.findFirst({
    where: and(eq(authenticator.userId, userId), eq(authenticator.credentialID, credentialID)),
  });
}
