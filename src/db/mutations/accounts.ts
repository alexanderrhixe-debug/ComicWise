import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { account } from "@/db/schema";

// ═══════════════════════════════════════════════════
// ACCOUNT MUTATIONS
// ═══════════════════════════════════════════════════

export async function createAccount(data: {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}) {
  const [newAccount] = await db.insert(account).values(data).returning();
  return newAccount;
}

export async function updateAccount(
  provider: string,
  providerAccountId: string,
  data: {
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
  }
) {
  const [updatedAccount] = await db
    .update(account)
    .set(data)
    .where(and(eq(account.provider, provider), eq(account.providerAccountId, providerAccountId)))
    .returning();
  return updatedAccount;
}

export async function deleteAccount(provider: string, providerAccountId: string) {
  const [deletedAccount] = await db
    .delete(account)
    .where(and(eq(account.provider, provider), eq(account.providerAccountId, providerAccountId)))
    .returning();
  return deletedAccount;
}

export async function deleteAccountsByUserId(userId: string) {
  return await db.delete(account).where(eq(account.userId, userId)).returning();
}
