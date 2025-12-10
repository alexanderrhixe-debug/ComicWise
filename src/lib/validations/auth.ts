import { z } from "zod";

// ═══════════════════════════════════════════════════
// AUTH VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  })
  .strict();

export const signInSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    email: z.string().email("Invalid email address"),
  })
  .strict();

export const resendVerificationSchema = z
  .object({
    email: z.string().email("Invalid email address"),
  })
  .strict();

// ═══════════════════════════════════════════════════
// USER VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const userSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100).nullable(),
    email: z.string().email(),
    emailVerified: z.date().nullable(),
    image: z.string().url().nullable(),
    password: z.string().nullable(),
    role: z.enum(["user", "admin", "moderator"]),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const createUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email(),
    password: z.string().min(8).optional(),
    image: z.string().url().optional().nullable(),
    role: z.enum(["user", "admin", "moderator"]).default("user"),
  })
  .strict();

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    image: z.string().url().optional().nullable(),
    role: z.enum(["user", "admin", "moderator"]).optional(),
    emailVerified: z.date().optional(),
  })
  .strict();

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ═══════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
