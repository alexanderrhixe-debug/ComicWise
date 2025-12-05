import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { bookmark, chapter, comic } from "@/db/schema";

export async function getUserBookmarks(userId: string) {
  const bookmarks = await db
    .select({
      bookmark: bookmark,
      comic: comic,
      chapter: chapter,
    })
    .from(bookmark)
    .leftJoin(comic, eq(bookmark.comicId, comic.id))
    .leftJoin(chapter, eq(bookmark.lastReadChapterId, chapter.id))
    .where(eq(bookmark.userId, userId))
    .orderBy(desc(bookmark.updatedAt));

  return bookmarks;
}

export async function isBookmarked(userId: string, comicId: number): Promise<boolean> {
  const result = await db
    .select()
    .from(bookmark)
    .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
    .limit(1);

  return result.length > 0;
}

export async function getBookmarkWithProgress(userId: string, comicId: number) {
  const result = await db
    .select({
      bookmark: bookmark,
      chapter: chapter,
    })
    .from(bookmark)
    .leftJoin(chapter, eq(bookmark.lastReadChapterId, chapter.id))
    .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
    .limit(1);

  return result[0] || null;
}

export async function getBookmarkCount(userId: string): Promise<number> {
  const result = await db
    .select({ comicId: bookmark.comicId })
    .from(bookmark)
    .where(eq(bookmark.userId, userId));

  return result.length;
}
