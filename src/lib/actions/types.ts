"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import * as mutations from "@/db/mutations";
import { createTypeSchema, updateTypeSchema } from "@/lib/validator";
import type { ActionResponse } from "@/types";
import { appConfig, checkRateLimit } from "app-config";

export async function createType(formData: FormData): Promise<ActionResponse<{ id: number }>> {
  try {
    // Rate limiting
    const rateLimit = checkRateLimit("create:type", appConfig.rateLimit.default);
    if (!rateLimit.allowed) {
      return { error: "Too many requests. Please try again later." };
    }

    const data = createTypeSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });

    const type = await mutations.createType(data);
    if (!type) {
      return { error: "Failed to create type" };
    }

    revalidatePath("/admin/types");
    return { success: true, data: { id: type.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    console.error("Create type error:", error);
    return { error: "Failed to create type" };
  }
}

export async function updateType(typeId: number, formData: FormData): Promise<ActionResponse> {
  try {
    const data = updateTypeSchema.parse({
      name: formData.get("name") || undefined,
      description: formData.get("description") || undefined,
    });

    await mutations.updateType(typeId, data);
    revalidatePath("/admin/types");
    revalidatePath(`/admin/types/${typeId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    console.error("Update type error:", error);
    return { error: "Failed to update type" };
  }
}

export async function deleteType(typeId: number): Promise<ActionResponse> {
  try {
    await mutations.deleteType(typeId);
    revalidatePath("/admin/types");

    return { success: true };
  } catch (error) {
    console.error("Delete type error:", error);
    return { error: "Failed to delete type" };
  }
}
