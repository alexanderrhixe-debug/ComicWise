"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import * as mutations from "@/db/mutations";
import { createArtistSchema, updateArtistSchema } from "@/lib/validator";
import type { ActionResponse } from "@/types";
import { appConfig, checkRateLimit } from "app-config";

export async function createArtist(formData: FormData): Promise<ActionResponse<{ id: number }>> {
  try {
    // Rate limiting
    const rateLimit = checkRateLimit("create:artist", appConfig.rateLimit.default);
    if (!rateLimit.allowed) {
      return { error: "Too many requests. Please try again later." };
    }

    const data = createArtistSchema.parse({
      name: formData.get("name"),
      bio: formData.get("bio") || undefined,
      image: formData.get("image") || undefined,
    });

    const cleanData = {
      name: data.name,
      bio: data.bio ?? undefined,
      image: data.image ?? undefined,
    };

    const artist = await mutations.createArtist(cleanData);
    if (!artist) {
      return { error: "Failed to create artist" };
    }

    revalidatePath("/admin/artists");
    return { success: true, data: { id: artist.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    console.error("Create artist error:", error);
    return { error: "Failed to create artist" };
  }
}

export async function updateArtist(artistId: number, formData: FormData): Promise<ActionResponse> {
  try {
    const data = updateArtistSchema.parse({
      name: formData.get("name") || undefined,
      bio: formData.get("bio") || undefined,
      image: formData.get("image") || undefined,
    });

    await mutations.updateArtist(artistId, data);
    revalidatePath("/admin/artists");
    revalidatePath(`/admin/artists/${artistId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    console.error("Update artist error:", error);
    return { error: "Failed to update artist" };
  }
}

export async function deleteArtist(artistId: number): Promise<ActionResponse> {
  try {
    await mutations.deleteArtist(artistId);
    revalidatePath("/admin/artists");

    return { success: true };
  } catch (error) {
    console.error("Delete artist error:", error);
    return { error: "Failed to delete artist" };
  }
}
