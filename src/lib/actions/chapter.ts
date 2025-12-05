"use server";

import { revalidatePath } from "next/cache";

import {
  createChapter as createChapterMutation,
  updateChapter as updateChapterMutation,
} from "@/db/mutations";
import { getChapterImages as getChapterImagesMutation } from "@/db/queries";
import { auth } from "lib/auth";

export async function getChapterImages(chapterId: number) {
  return await getChapterImagesMutation(chapterId);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createChapter(data: any) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized - Admin only");
  }

  const chapter = await createChapterMutation(data);
  revalidatePath(`/comics/${data.comicId}`);
  revalidatePath("/admin/chapters");

  return chapter;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateChapter(id: number, data: any) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized - Admin only");
  }

  const chapter = await updateChapterMutation(id, data);
  revalidatePath(`/comics/${data.comicId}`);
  revalidatePath(`/comics/${data.comicId}/read/${id}`);
  revalidatePath("/admin/chapters");

  return chapter;
}
