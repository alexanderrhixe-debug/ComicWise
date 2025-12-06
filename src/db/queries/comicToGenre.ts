import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { comicToGenre } from "@/db/schema";

export async function getComicGenres(comicId: number) {
  return await db.query.comicToGenre.findMany({
    where: eq(comicToGenre.comicId, comicId),
    with: {
      genre: true,
    },
  });
}

export async function getGenreComics(genreId: number) {
  return await db.query.comicToGenre.findMany({
    where: eq(comicToGenre.genreId, genreId),
    with: {
      comic: true,
    },
  });
}
