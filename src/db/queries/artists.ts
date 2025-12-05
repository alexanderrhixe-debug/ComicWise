import { asc, desc, eq, ilike } from "drizzle-orm";

import { db } from "../client";
import { artist } from "../schema";

export async function getArtistById(artistId: number) {
  return await db.query.artist.findFirst({
    where: eq(artist.id, artistId),
  });
}

export async function getArtists(params?: {
  limit?: number;
  offset?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}) {
  const { limit = 10, offset = 0, sortBy = "name", sortOrder = "asc", search } = params || {};

  let query = db.select().from(artist).$dynamic();

  // Apply search filter
  if (search) {
    query = query.where(ilike(artist.name, `%${search}%`));
  }

  // Apply sorting
  // eslint-disable-next-line security/detect-object-injection
  const sortColumn = artist[sortBy];
  query = query.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn));

  // Apply pagination
  query = query.limit(limit).offset(offset);

  return await query;
}

export async function getArtistCount(params?: { search?: string }) {
  const { search } = params || {};

  let query = db.select().from(artist).$dynamic();

  if (search) {
    query = query.where(ilike(artist.name, `%${search}%`));
  }

  const result = await query;
  return result.length;
}
