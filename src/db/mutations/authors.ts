import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { author } from "@/db/schema";

export async function createAuthor(data: { name: string; bio?: string; image?: string }) {
  const [newAuthor] = await db
    .insert(author)
    .values({
      name: data.name,
      bio: data.bio,
      image: data.image,
      createdAt: new Date(),
    })
    .returning();
  return newAuthor;
}

export async function updateAuthor(
  authorId: number,
  data: {
    name?: string;
    bio?: string | null;
    image?: string | null;
  }
) {
  const cleanData = {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.bio !== undefined && { bio: data.bio || null }),
    ...(data.image !== undefined && { image: data.image || null }),
  };
  const [updatedAuthor] = await db
    .update(author)
    .set(cleanData)
    .where(eq(author.id, authorId))
    .returning();
  return updatedAuthor;
}

export async function deleteAuthor(authorId: number) {
  const [deletedAuthor] = await db.delete(author).where(eq(author.id, authorId)).returning();
  return deletedAuthor;
}
