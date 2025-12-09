import { db } from "@/db/client";
import { chapterImage } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getChapterImageById(imageId: number) {
  return await db.query.chapterImage.findFirst({
    where: eq(chapterImage.id, imageId),
  });
}

export async function getChapterImages(chapterId: number) {
  return await db.query.chapterImage.findMany({
    where: eq(chapterImage.chapterId, chapterId),
    orderBy: asc(chapterImage.pageNumber),
  });
}

export async function getChapterImageCount(chapterId: number) {
  const images = await db.select().from(chapterImage).where(eq(chapterImage.chapterId, chapterId));
  return images.length;
}
