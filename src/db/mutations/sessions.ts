import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { session } from "@/db/schema";

// ═══════════════════════════════════════════════════
// SESSION MUTATIONS
// ═══════════════════════════════════════════════════

export async function createSession(data: { sessionToken: string; userId: string; expires: Date }) {
  const [newSession] = await db.insert(session).values(data).returning();
  return newSession;
}

export async function updateSession(sessionToken: string, data: { expires?: Date }) {
  const [updatedSession] = await db
    .update(session)
    .set(data)
    .where(eq(session.sessionToken, sessionToken))
    .returning();
  return updatedSession;
}

export async function deleteSession(sessionToken: string) {
  const [deletedSession] = await db
    .delete(session)
    .where(eq(session.sessionToken, sessionToken))
    .returning();
  return deletedSession;
}

export async function deleteSessionsByUserId(userId: string) {
  return await db.delete(session).where(eq(session.userId, userId)).returning();
}

export async function deleteExpiredSessions() {
  const now = new Date();
  return await db.delete(session).where(eq(session.expires, now)).returning();
}
