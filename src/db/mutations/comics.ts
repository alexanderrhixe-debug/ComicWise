import { db } from "@/db/client";
import { chapter, comic, comicToGenre } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

interface CreateComicData {
  title: string;
  description: string;
  coverImage: string;
  status?: "Ongoing" | "Hiatus" | "Completed" | "Dropped" | "Coming Soon";
  publicationDate: Date;
  authorId?: number;
  artistId?: number;
  typeId?: number;
  genreIds?: number[];
}

export async function createComic(data: CreateComicData) {
  const { genreIds, ...comicData } = data;

  const [newComic] = await db
    .insert(comic)
    .values({
      ...comicData,
      status: comicData.status || "Ongoing",
      rating: "0",
      views: 0,
    })
    .returning();

  if (!newComic) {
    throw new Error("Failed to create comic");
  }

  if (genreIds && genreIds.length > 0) {
    await db.insert(comicToGenre).values(
      genreIds.map((genreId) => ({
        comicId: newComic.id,
        genreId,
      }))
    );
  }

  return newComic;
}

interface UpdateComicData {
  title?: string;
  description?: string;
  coverImage?: string;
  status?: "Ongoing" | "Hiatus" | "Completed" | "Dropped" | "Coming Soon";
  publicationDate?: Date;
  authorId?: number;
  artistId?: number;
  typeId?: number;
  genreIds?: number[];
}

export async function updateComic(comicId: number, data: UpdateComicData) {
  const { genreIds, ...updateData } = data;

  const [updatedComic] = await db
    .update(comic)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(comic.id, comicId))
    .returning();

  if (genreIds !== undefined) {
    await db.delete(comicToGenre).where(eq(comicToGenre.comicId, comicId));

    if (genreIds.length > 0) {
      await db.insert(comicToGenre).values(
        genreIds.map((genreId) => ({
          comicId,
          genreId,
        }))
      );
    }
  }

  return updatedComic;
}

export async function deleteComic(comicId: number) {
  await db.delete(chapter).where(eq(chapter.comicId, comicId));

  await db.delete(comicToGenre).where(eq(comicToGenre.comicId, comicId));

  const [deletedComic] = await db.delete(comic).where(eq(comic.id, comicId)).returning();

  return deletedComic;
}

export async function incrementViews(comicId: number) {
  const [updated] = await db
    .update(comic)
    .set({
      views: sql`${comic.views} + 1`,
    })
    .where(eq(comic.id, comicId))
    .returning();

  return updated;
}

export async function updateComicRating(comicId: number, newRating: number) {
  const [updated] = await db
    .update(comic)
    .set({
      rating: newRating.toFixed(2),
    })
    .where(eq(comic.id, comicId))
    .returning();

  return updated;
}
