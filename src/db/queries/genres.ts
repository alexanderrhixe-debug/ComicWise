import { asc, desc, eq, ilike } from "drizzle-orm";

import { db } from "../client";
import { genre } from "../schema";

export async function getGenreById(genreId: number) {
  return await db.query.genre.findFirst({
    where: eq(genre.id, genreId),
  });
}

export async function getGenreByName(name: string) {
  return await db.query.genre.findFirst({
    where: eq(genre.name, name),
  });
}

export async function getGenres(params?: {
  limit?: number;
  offset?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}) {
  const { limit = 10, offset = 0, sortBy = "name", sortOrder = "asc", search } = params || {};

  let query = db.select().from(genre).$dynamic();

  // Apply search filter
  if (search) {
    query = query.where(ilike(genre.name, `%${search}%`));
  }

  // Apply sorting
  const sortColumn = genre[sortBy];
  query = query.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn));

  // Apply pagination
  query = query.limit(limit).offset(offset);

  return await query;
}

export async function getGenreCount(params?: { search?: string }) {
  const { search } = params || {};

  let query = db.select().from(genre).$dynamic();

  if (search) {
    query = query.where(ilike(genre.name, `%${search}%`));
  }

  const result = await query;
  return result.length;
}
