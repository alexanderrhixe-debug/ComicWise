import { asc, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "../client";
import { user } from "../schema";

export async function getUserById(userId: string) {
  return await db.query.user.findFirst({
    where: eq(user.id, userId),
  });
}

export async function getUserByEmail(email: string) {
  return await db.query.user.findFirst({
    where: eq(user.email, email),
  });
}

export async function getUsers(params?: {
  limit?: number;
  offset?: number;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  role?: "user" | "admin" | "moderator";
}) {
  const {
    limit = 10,
    offset = 0,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    role,
  } = params || {};

  let query = db.select().from(user).$dynamic();

  // Apply filters
  const conditions = [];
  if (search) {
    conditions.push(or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)));
  }
  if (role) {
    conditions.push(eq(user.role, role));
  }

  if (conditions.length > 0) {
    query = query.where(or(...conditions));
  }

  // Apply sorting
  const sortColumn = user[sortBy];
  query = query.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn));

  // Apply pagination
  query = query.limit(limit).offset(offset);

  return await query;
}

export async function getUserCount(params?: {
  search?: string;
  role?: "user" | "admin" | "moderator";
}) {
  const { search, role } = params || {};

  let query = db.select().from(user).$dynamic();

  const conditions = [];
  if (search) {
    conditions.push(or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)));
  }
  if (role) {
    conditions.push(eq(user.role, role));
  }

  if (conditions.length > 0) {
    query = query.where(or(...conditions));
  }

  const result = await query;
  return result.length;
}
