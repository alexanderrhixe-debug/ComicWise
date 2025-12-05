import { and, eq } from "drizzle-orm";

import { db } from "../client";
import { authenticator } from "../schema";

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
