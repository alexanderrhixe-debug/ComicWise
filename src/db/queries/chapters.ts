import { eq, asc, desc, and, gt, lt } from "drizzle-orm";

import { db } from "@/db/client";
import { chapter, chapterImage, comic } from "@/db/schema";

export async function getChaptersByComicId(comicId: number) {
  return await db
    .select()
    .from(chapter)
    .where(eq(chapter.comicId, comicId))
    .orderBy(asc(chapter.chapterNumber));
}

export async function getChapter(chapterId: number) {
  const result = await db
    .select({
      chapter: chapter,
      comic: comic,
    })
    .from(chapter)
    .leftJoin(comic, eq(chapter.comicId, comic.id))
    .where(eq(chapter.id, chapterId))
    .limit(1);

  if (!result[0]) return null;

  const images = await db
    .select()
    .from(chapterImage)
    .where(eq(chapterImage.chapterId, chapterId))
    .orderBy(asc(chapterImage.pageNumber));

  return {
    ...result[0].chapter,
    comic: result[0].comic,
    images,
  };
}

export async function getChapterImages(chapterId: number) {
  return await db
    .select()
    .from(chapterImage)
    .where(eq(chapterImage.chapterId, chapterId))
    .orderBy(asc(chapterImage.pageNumber));
}

export async function getNextChapter(currentChapterId: number) {
  const current = await db.select().from(chapter).where(eq(chapter.id, currentChapterId)).limit(1);

  if (!current[0]) return null;

  const next = await db
    .select()
    .from(chapter)
    .where(
      and(
        eq(chapter.comicId, current[0].comicId),
        gt(chapter.chapterNumber, current[0].chapterNumber)
      )
    )
    .orderBy(asc(chapter.chapterNumber))
    .limit(1);

  return next[0] || null;
}

export async function getPreviousChapter(currentChapterId: number) {
  const current = await db.select().from(chapter).where(eq(chapter.id, currentChapterId)).limit(1);

  if (!current[0]) return null;

  const previous = await db
    .select()
    .from(chapter)
    .where(
      and(
        eq(chapter.comicId, current[0].comicId),
        lt(chapter.chapterNumber, current[0].chapterNumber)
      )
    )
    .orderBy(desc(chapter.chapterNumber))
    .limit(1);

  return previous[0] || null;
}

export async function getFirstChapter(comicId: number) {
  const result = await db
    .select()
    .from(chapter)
    .where(eq(chapter.comicId, comicId))
    .orderBy(asc(chapter.chapterNumber))
    .limit(1);

  return result[0] || null;
}

export async function getLatestChapter(comicId: number) {
  const result = await db
    .select()
    .from(chapter)
    .where(eq(chapter.comicId, comicId))
    .orderBy(desc(chapter.chapterNumber))
    .limit(1);

  return result[0] || null;
}
