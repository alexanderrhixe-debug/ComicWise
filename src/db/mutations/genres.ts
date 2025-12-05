import { eq } from "drizzle-orm";

import { db } from "../client";
import { genre } from "../schema";

export async function createGenre(data: { name: string; description?: string | null }) {
  const [newGenre] = await db
    .insert(genre)
    .values({
      name: data.name,
      description: data.description || null,
      createdAt: new Date(),
    })
    .returning();
  return newGenre;
}

export async function updateGenre(
  genreId: number,
  data: {
    name?: string;
    description?: string | null;
  }
) {
  const cleanData: Partial<typeof genre.$inferInsert> = {};
  if (data.name !== undefined) cleanData.name = data.name;
  if (data.description !== undefined) cleanData.description = data.description || null;

  const [updatedGenre] = await db
    .update(genre)
    .set(cleanData)
    .where(eq(genre.id, genreId))
    .returning();
  return updatedGenre;
}

export async function deleteGenre(genreId: number) {
  const [deletedGenre] = await db.delete(genre).where(eq(genre.id, genreId)).returning();
  return deletedGenre;
}
