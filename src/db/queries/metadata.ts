import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { genre, type } from "@/db/schema";

export async function getAllTypes() {
  return await db.select().from(type).orderBy(asc(type.name));
}

export async function getAllGenres() {
  return await db.select().from(genre).orderBy(asc(genre.name));
}

export async function getType(id: number) {
  const [result] = await db.select().from(type).where(eq(type.id, id));
  return result;
}

export async function getGenre(id: number) {
  const [result] = await db.select().from(genre).where(eq(genre.id, id));
  return result;
}
