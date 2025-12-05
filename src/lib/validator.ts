// ═══════════════════════════════════════════════════
// RE-EXPORT ALL VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════
export * from "./validations";

import { z } from "zod";

import { userSchema } from "./validations";

// ═══════════════════════════════════════════════════
// SEED DATA VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const seedUserSchema = userSchema.extend({
  id: z.string().uuid().optional(),
  emailVerified: z.coerce.date().nullable().optional(),
  password: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const seedComicSchema = z.object({
  url: z.string().url().optional(),
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  images: z.array(z.object({ url: z.string().url() })).optional(),
  description: z.string().min(1),
  rating: z.string().optional(),
  status: z.string().optional(),
  publicationDate: z.string().or(z.coerce.date()).optional(),
  updatedAt: z.string().optional(),
  serialization: z.string().optional(),
  coverImage: z.string().optional(),
  type: z.object({ name: z.string() }).optional(),
  artist: z.object({ name: z.string() }).optional(),
  author: z.object({ name: z.string() }).optional(),
  genres: z.array(z.object({ name: z.string() })).optional(),
});

export const seedChapterSchema = z.object({
  url: z.string().url().optional(),
  name: z.string(),
  title: z.string().optional(),
  chapterNumber: z.number().optional(),
  comic: z.object({
    title: z.string(),
    slug: z.string().optional(),
  }),
  releaseDate: z.string().or(z.coerce.date()).optional(),
  updatedAt: z.string().optional(),
  images: z.array(z.object({ url: z.string().url() })).optional(),
});

export const seedDataSchema = z.object({
  users: z.array(seedUserSchema).optional(),
  comics: z.array(seedComicSchema).optional(),
  chapters: z.array(seedChapterSchema).optional(),
  data: z.record(z.string(), z.any()).optional(),
});

// ═══════════════════════════════════════════════════
// EMAIL VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const emailSchema = z.object({
  to: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export const verificationEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  token: z.string().min(1, "Token is required"),
});

export const resetPasswordEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  token: z.string().min(1, "Token is required"),
});

// ═══════════════════════════════════════════════════
// WORKFLOW SCHEMAS
// ═══════════════════════════════════════════════════

export const workflowSchema = z.object({
  action: z.enum(["register", "forgot-password", "verify-email", "reset-password"]),
  data: z.record(z.string(), z.any()),
});

// ═══════════════════════════════════════════════════
// TYPE EXPORTS FOR SEED DATA
// ═══════════════════════════════════════════════════

export type SeedUserInput = z.infer<typeof seedUserSchema>;
export type SeedComicInput = z.infer<typeof seedComicSchema>;
export type SeedChapterInput = z.infer<typeof seedChapterSchema>;
export type SeedDataInput = z.infer<typeof seedDataSchema>;

export type EmailInput = z.infer<typeof emailSchema>;
export type VerificationEmailInput = z.infer<typeof verificationEmailSchema>;
export type ResetPasswordEmailInput = z.infer<typeof resetPasswordEmailSchema>;
export type WorkflowInput = z.infer<typeof workflowSchema>;
