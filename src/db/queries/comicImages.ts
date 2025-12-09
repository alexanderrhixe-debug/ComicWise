import { db } from "@/db/client";
import { comicImage } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getComicImageById(imageId: number) {
  return await db.query.comicImage.findFirst({
    where: eq(comicImage.id, imageId),
  });
}

export async function getComicImages(comicId: number) {
  return await db.query.comicImage.findMany({
    where: eq(comicImage.comicId, comicId),
    orderBy: asc(comicImage.imageOrder),
  });
}

export async function getComicImageCount(comicId: number) {
  const images = await db.select().from(comicImage).where(eq(comicImage.comicId, comicId));
  return images.length;
}
