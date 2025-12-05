import { asc, desc, eq, ilike } from "drizzle-orm";

import { db } from "../client";
import { author } from "../schema";

export async function getAuthorById(authorId: number) {
  return await db.query.author.findFirst({
    where: eq(author.id, authorId),
  });
}

export async function getAuthors(params?: {
  limit?: number;
  offset?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}) {
  const { limit = 10, offset = 0, sortBy = "name", sortOrder = "asc", search } = params || {};

  let query = db.select().from(author).$dynamic();

  // Apply search filter
  if (search) {
    query = query.where(ilike(author.name, `%${search}%`));
  }

  // Apply sorting
  // eslint-disable-next-line security/detect-object-injection
  const sortColumn = author[sortBy];
  query = query.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn));

  // Apply pagination
  query = query.limit(limit).offset(offset);

  return await query;
}

export async function getAuthorCount(params?: { search?: string }) {
  const { search } = params || {};

  let query = db.select().from(author).$dynamic();

  if (search) {
    query = query.where(ilike(author.name, `%${search}%`));
  }

  const result = await query;
  return result.length;
}
