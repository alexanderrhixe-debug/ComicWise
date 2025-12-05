"use server";

import { revalidatePath } from "next/cache";

import {
  createComic as createComicMutation,
  deleteComic as deleteComicMutation,
  updateComic as updateComicMutation,
} from "@/db/mutations";
import { getAllComics, getComic } from "@/db/queries";
import type { ComicFilters } from "@/types";
import { auth } from "lib/auth";

export async function getComics(filters?: ComicFilters) {
  return await getAllComics(filters);
}

export async function getComicById(id: number) {
  return await getComic(id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createComic(data: any) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized - Admin only");
  }

  const comic = await createComicMutation(data);
  revalidatePath("/comics");
  revalidatePath("/admin/comics");

  return comic;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateComic(id: number, data: any) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized - Admin only");
  }

  const comic = await updateComicMutation(id, data);
  revalidatePath("/comics");
  revalidatePath(`/comics/${id}`);
  revalidatePath("/admin/comics");

  return comic;
}

export async function deleteComic(id: number) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized - Admin only");
  }

  await deleteComicMutation(id);
  revalidatePath("/comics");
  revalidatePath("/admin/comics");

  return { success: true };
}
