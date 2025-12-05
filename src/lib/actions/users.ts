"use server";

import crypto from "crypto";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import * as mutations from "@/db/mutations";
import * as queries from "@/db/queries";
import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/nodemailer";
import { registerSchema } from "@/lib/validator";
import type { ActionResponse } from "@/types";
import { appConfig, checkRateLimit } from "app-config";

const updateUserAdminSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["user", "admin", "moderator"]).optional(),
  image: z.string().url().optional().nullable(),
});

export async function registerUser(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    // Rate limiting
    const email = formData.get("email") as string;
    const rateLimit = checkRateLimit(`register:${email}`, appConfig.rateLimit.auth);
    if (!rateLimit.allowed) {
      return { error: "Too many registration attempts. Please try again later." };
    }

    const data = registerSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Check if user already exists
    const existingUser = await queries.getUserByEmail(data.email);
    if (existingUser) {
      return { error: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await mutations.createUser({
      ...data,
      password: hashedPassword,
    });

    if (!user) {
      return { error: "Failed to create user" };
    }

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name || "User");

    return { success: true, data: { id: user.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    console.error("Register user error:", error);
    return { error: "Failed to register user" };
  }
}

export async function updateUser(userId: string, formData: FormData): Promise<ActionResponse> {
  try {
    const data = updateUserAdminSchema.parse({
      name: formData.get("name") || undefined,
      email: formData.get("email") || undefined,
      role: formData.get("role") || undefined,
      image: formData.get("image") || undefined,
    });

    await mutations.updateUser(userId, data);
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    console.error("Update user error:", error);
    return { error: "Failed to update user" };
  }
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
  try {
    await mutations.deleteUser(userId);
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "Failed to delete user" };
  }
}

export async function requestPasswordReset(email: string): Promise<ActionResponse> {
  try {
    // Rate limiting
    const rateLimit = checkRateLimit(`password-reset:${email}`, appConfig.rateLimit.email);
    if (!rateLimit.allowed) {
      return { error: "Too many password reset requests. Please try again later." };
    }

    const user = await queries.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    // Delete any existing tokens for this email
    await mutations.deletePasswordResetTokensByEmail(email);

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await mutations.createPasswordResetToken({
      email,
      token,
      expires,
    });

    // Send reset email
    await sendPasswordResetEmail(email, user.name || "User", token);

    return { success: true };
  } catch (error) {
    console.error("Password reset request error:", error);
    return { error: "Failed to process password reset request" };
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<ActionResponse> {
  try {
    const resetToken = await queries.getPasswordResetToken(token);

    if (!resetToken) {
      return { error: "Invalid or expired reset token" };
    }

    if (new Date() > resetToken.expires) {
      return { error: "Reset token has expired" };
    }

    const user = await queries.getUserByEmail(resetToken.email);
    if (!user) {
      return { error: "User not found" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await mutations.updateUserPassword(user.id, hashedPassword);

    // Delete the used token
    await mutations.deletePasswordResetToken(token);

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "Failed to reset password" };
  }
}
