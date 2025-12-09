import { db } from "@/db/client";
import { chapter, chapterImage } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

interface CreateChapterData {
  title: string;
  chapterNumber: number;
  releaseDate: Date;
  comicId: number;
}

export async function createChapter(data: CreateChapterData) {
  const [newChapter] = await db
    .insert(chapter)
    .values({
      ...data,
      views: 0,
    })
    .returning();

  return newChapter;
}

interface UpdateChapterData {
  title?: string;
  chapterNumber?: number;
  releaseDate?: Date;
}

export async function updateChapter(chapterId: number, data: UpdateChapterData) {
  const [updated] = await db.update(chapter).set(data).where(eq(chapter.id, chapterId)).returning();

  return updated;
}

export async function deleteChapter(chapterId: number) {
  await db.delete(chapterImage).where(eq(chapterImage.chapterId, chapterId));

  const [deleted] = await db.delete(chapter).where(eq(chapter.id, chapterId)).returning();

  return deleted;
}

export async function incrementChapterViews(chapterId: number) {
  const [updated] = await db
    .update(chapter)
    .set({
      views: sql`${chapter.views} + 1`,
    })
    .where(eq(chapter.id, chapterId))
    .returning();

  return updated;
}

interface AddChapterImageData {
  chapterId: number;
  imageUrl: string;
  pageNumber: number;
}

export async function addChapterImage(data: AddChapterImageData) {
  const [newImage] = await db.insert(chapterImage).values(data).returning();

  return newImage;
}

export async function addChapterImages(chapterId: number, imageUrls: string[]) {
  const images = imageUrls.map((url, index) => ({
    chapterId,
    imageUrl: url,
    pageNumber: index + 1,
  }));

  return await db.insert(chapterImage).values(images).returning();
}

export async function deleteChapterImage(imageId: number) {
  const [deleted] = await db.delete(chapterImage).where(eq(chapterImage.id, imageId)).returning();

  return deleted;
}
