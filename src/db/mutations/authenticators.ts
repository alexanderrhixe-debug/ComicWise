import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { authenticator } from "@/db/schema";

// ═══════════════════════════════════════════════════
// AUTHENTICATOR MUTATIONS
// ═══════════════════════════════════════════════════

export async function createAuthenticator(data: {
  credentialID: string;
  userId: string;
  providerAccountId: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: string | null;
}) {
  const [newAuthenticator] = await db.insert(authenticator).values(data).returning();
  return newAuthenticator;
}

export async function updateAuthenticator(
  userId: string,
  credentialID: string,
  data: {
    counter?: number;
    credentialBackedUp?: boolean;
    transports?: string | null;
  }
) {
  const [updatedAuthenticator] = await db
    .update(authenticator)
    .set(data)
    .where(and(eq(authenticator.userId, userId), eq(authenticator.credentialID, credentialID)))
    .returning();
  return updatedAuthenticator;
}

export async function deleteAuthenticator(userId: string, credentialID: string) {
  const [deletedAuthenticator] = await db
    .delete(authenticator)
    .where(and(eq(authenticator.userId, userId), eq(authenticator.credentialID, credentialID)))
    .returning();
  return deletedAuthenticator;
}

export async function deleteAuthenticatorsByUserId(userId: string) {
  return await db.delete(authenticator).where(eq(authenticator.userId, userId)).returning();
}
