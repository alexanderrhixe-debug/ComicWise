import { asc, desc, eq, ilike } from "drizzle-orm";

import { db } from "../client";
import { type } from "../schema";

export async function getTypeById(typeId: number) {
  return await db.query.type.findFirst({
    where: eq(type.id, typeId),
  });
}

export async function getTypeByName(name: string) {
  return await db.query.type.findFirst({
    where: eq(type.name, name),
  });
}

export async function getTypes(params?: {
  limit?: number;
  offset?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}) {
  const { limit = 10, offset = 0, sortBy = "name", sortOrder = "asc", search } = params || {};

  let query = db.select().from(type).$dynamic();

  // Apply search filter
  if (search) {
    query = query.where(ilike(type.name, `%${search}%`));
  }

  // Apply sorting
  // eslint-disable-next-line security/detect-object-injection
  const sortColumn = type[sortBy];
  query = query.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn));

  // Apply pagination
  query = query.limit(limit).offset(offset);

  return await query;
}

export async function getTypeCount(params?: { search?: string }) {
  const { search } = params || {};

  let query = db.select().from(type).$dynamic();

  if (search) {
    query = query.where(ilike(type.name, `%${search}%`));
  }

  const result = await query;
  return result.length;
}
