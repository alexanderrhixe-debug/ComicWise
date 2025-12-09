import { db } from "@/db/client";
import { comicToGenre } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function addGenreToComic(comicId: number, genreId: number) {
  const [newRelation] = await db
    .insert(comicToGenre)
    .values({
      comicId,
      genreId,
    })
    .returning();
  return newRelation;
}

export async function addGenresToComic(comicId: number, genreIds: number[]) {
  const relations = await db
    .insert(comicToGenre)
    .values(genreIds.map((genreId) => ({ comicId, genreId })))
    .returning();
  return relations;
}

export async function removeGenreFromComic(comicId: number, genreId: number) {
  const [deletedRelation] = await db
    .delete(comicToGenre)
    .where(and(eq(comicToGenre.comicId, comicId), eq(comicToGenre.genreId, genreId)))
    .returning();
  return deletedRelation;
}

export async function removeAllGenresFromComic(comicId: number) {
  const deletedRelations = await db
    .delete(comicToGenre)
    .where(eq(comicToGenre.comicId, comicId))
    .returning();
  return deletedRelations;
}

export async function updateComicGenres(comicId: number, genreIds: number[]) {
  // Remove existing genres
  await db.delete(comicToGenre).where(eq(comicToGenre.comicId, comicId));

  // Add new genres
  if (genreIds.length > 0) {
    return await addGenresToComic(comicId, genreIds);
  }
  return [];
}
