import { eq } from "drizzle-orm";

import { db } from "../client";
import { type } from "../schema";

export async function createType(data: { name: string; description?: string | null }) {
  const [newType] = await db
    .insert(type)
    .values({
      name: data.name,
      description: data.description || null,
      createdAt: new Date(),
    })
    .returning();
  return newType;
}

export async function updateType(
  typeId: number,
  data: {
    name?: string;
    description?: string | null;
  }
) {
  const cleanData: Partial<typeof type.$inferInsert> = {};
  if (data.name !== undefined) cleanData.name = data.name;
  if (data.description !== undefined) cleanData.description = data.description || null;

  const [updatedType] = await db.update(type).set(cleanData).where(eq(type.id, typeId)).returning();
  return updatedType;
}

export async function deleteType(typeId: number) {
  const [deletedType] = await db.delete(type).where(eq(type.id, typeId)).returning();
  return deletedType;
}
