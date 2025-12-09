import { db } from "@/db/client";
import { comicImage } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createComicImage(data: {
  comicId: number;
  imageUrl: string;
  imageOrder: number;
}) {
  const [newImage] = await db
    .insert(comicImage)
    .values({
      comicId: data.comicId,
      imageUrl: data.imageUrl,
      imageOrder: data.imageOrder,
      createdAt: new Date(),
    })
    .returning();
  return newImage;
}

export async function createComicImages(
  images: Array<{
    comicId: number;
    imageUrl: string;
    imageOrder: number;
  }>
) {
  const newImages = await db
    .insert(comicImage)
    .values(
      images.map((img) => ({
        ...img,
        createdAt: new Date(),
      }))
    )
    .returning();
  return newImages;
}

export async function updateComicImage(
  imageId: number,
  data: {
    imageUrl?: string;
    imageOrder?: number;
  }
) {
  const [updatedImage] = await db
    .update(comicImage)
    .set(data)
    .where(eq(comicImage.id, imageId))
    .returning();
  return updatedImage;
}

export async function deleteComicImage(imageId: number) {
  const [deletedImage] = await db.delete(comicImage).where(eq(comicImage.id, imageId)).returning();
  return deletedImage;
}

export async function deleteComicImages(comicId: number) {
  const deletedImages = await db
    .delete(comicImage)
    .where(eq(comicImage.comicId, comicId))
    .returning();
  return deletedImages;
}
