import { db } from "@/db/client";
import { account } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// ACCOUNT QUERIES
// ═══════════════════════════════════════════════════

export async function getAccountByProvider(userId: string, provider: string) {
  return await db.query.account.findFirst({
    where: and(eq(account.userId, userId), eq(account.provider, provider)),
  });
}

export async function getAccountsByUserId(userId: string) {
  return await db.query.account.findMany({
    where: eq(account.userId, userId),
  });
}

export async function getAccountByProviderAccountId(provider: string, providerAccountId: string) {
  return await db.query.account.findFirst({
    where: and(eq(account.provider, provider), eq(account.providerAccountId, providerAccountId)),
  });
}
