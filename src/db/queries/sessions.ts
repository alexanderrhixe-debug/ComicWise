import { and, eq, gt } from "drizzle-orm";

import { db } from "@/db/client";
import { session } from "@/db/schema";

// ═══════════════════════════════════════════════════
// SESSION QUERIES
// ═══════════════════════════════════════════════════

export async function getSessionByToken(sessionToken: string) {
  return await db.query.session.findFirst({
    where: eq(session.sessionToken, sessionToken),
  });
}

export async function getSessionsByUserId(userId: string) {
  return await db.query.session.findMany({
    where: eq(session.userId, userId),
  });
}

export async function getActiveSessions(userId: string) {
  const now = new Date();
  return await db
    .select()
    .from(session)
    .where(and(eq(session.userId, userId), gt(session.expires, now)));
}
