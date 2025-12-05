import { eq } from "drizzle-orm";

import { db } from "../client";
import { artist } from "../schema";

export async function createArtist(data: { name: string; bio?: string; image?: string }) {
  const [newArtist] = await db
    .insert(artist)
    .values({
      name: data.name,
      bio: data.bio,
      image: data.image,
      createdAt: new Date(),
    })
    .returning();
  return newArtist;
}

export async function updateArtist(
  artistId: number,
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
  const [updatedArtist] = await db
    .update(artist)
    .set(cleanData)
    .where(eq(artist.id, artistId))
    .returning();
  return updatedArtist;
}

export async function deleteArtist(artistId: number) {
  const [deletedArtist] = await db.delete(artist).where(eq(artist.id, artistId)).returning();
  return deletedArtist;
}
