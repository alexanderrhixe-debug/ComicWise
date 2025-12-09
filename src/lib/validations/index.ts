// ═══════════════════════════════════════════════════
// COMPREHENSIVE VALIDATIONS (Next.js 16 Optimized)
// ═══════════════════════════════════════════════════

// Export all schemas from schemas.ts
export * from "lib/validations/schemas";

import { z } from "zod";

// ═══════════════════════════════════════════════════
// ADDITIONAL UTILITY SCHEMAS
// ═══════════════════════════════════════════════════

export const userSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    emailVerified: z.date().nullable(),
    image: z.string().url().nullable(),
    password: z.string().optional(),
    role: z.enum(["user", "admin", "moderator"]).default("user"),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const createUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["user", "admin", "moderator"]).optional().default("user"),
    image: z.string().url().optional(),
  })
  .strict();

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    role: z.enum(["user", "admin", "moderator"]).optional(),
    image: z.string().url().optional().nullable(),
    emailVerified: z.date().optional().nullable(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// AUTH VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
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
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  })
  .strict();

export const verifyEmailSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
  })
  .strict();

// ═══════════════════════════════════════════════════
// COMIC VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const comicSchema = z
  .object({
    id: z.number().int().positive(),
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().min(10, "Description must be at least 10 characters"),
    coverImage: z.string().url("Invalid image URL"),
    status: z.enum(["Ongoing", "Hiatus", "Completed", "Dropped", "Coming Soon"]),
    publicationDate: z.date(),
    rating: z.string().optional().nullable(),
    views: z.number().int().nonnegative().default(0),
    authorId: z.number().int().positive().optional().nullable(),
    artistId: z.number().int().positive().optional().nullable(),
    typeId: z.number().int().positive().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const createComicSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().min(10, "Description must be at least 10 characters"),
    coverImage: z.string().url("Invalid image URL"),
    status: z.enum(["Ongoing", "Hiatus", "Completed", "Dropped", "Coming Soon"]).default("Ongoing"),
    publicationDate: z.coerce.date(),
    authorId: z.number().int().positive().optional().nullable(),
    artistId: z.number().int().positive().optional().nullable(),
    typeId: z.number().int().positive().optional().nullable(),
    genreIds: z.array(z.number().int().positive()).optional(),
  })
  .strict();

export const updateComicSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().min(10).optional(),
    coverImage: z.string().url().optional(),
    status: z.enum(["Ongoing", "Hiatus", "Completed", "Dropped", "Coming Soon"]).optional(),
    publicationDate: z.coerce.date().optional(),
    authorId: z.number().int().positive().optional().nullable(),
    artistId: z.number().int().positive().optional().nullable(),
    typeId: z.number().int().positive().optional().nullable(),
    genreIds: z.array(z.number().int().positive()).optional(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// CHAPTER VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const chapterSchema = z
  .object({
    id: z.number().int().positive(),
    title: z.string().min(1, "Title is required").max(255),
    chapterNumber: z.number().int().positive("Chapter number must be positive"),
    releaseDate: z.date(),
    comicId: z.number().int().positive("Comic ID is required"),
    views: z.number().int().nonnegative().default(0),
    createdAt: z.date(),
  })
  .strict();

export const createChapterSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255),
    chapterNumber: z.number().int().positive("Chapter number must be positive"),
    releaseDate: z.coerce.date(),
    comicId: z.number().int().positive("Comic ID is required"),
  })
  .strict();

export const updateChapterSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    chapterNumber: z.number().int().positive().optional(),
    releaseDate: z.coerce.date().optional(),
    comicId: z.number().int().positive().optional(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// AUTHOR VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const authorSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1, "Name is required").max(255),
    bio: z.string().optional().nullable(),
    image: z.string().url("Invalid image URL").optional().nullable(),
    createdAt: z.date(),
  })
  .strict();

export const createAuthorSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255),
    bio: z.string().optional(),
    image: z.string().url("Invalid image URL").optional(),
  })
  .strict();

export const updateAuthorSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    bio: z.string().optional().nullable(),
    image: z.string().url().optional().nullable(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// ARTIST VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const artistSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1, "Name is required").max(255),
    bio: z.string().optional().nullable(),
    image: z.string().url("Invalid image URL").optional().nullable(),
    createdAt: z.date(),
  })
  .strict();

export const createArtistSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255),
    bio: z.string().optional(),
    image: z.string().url("Invalid image URL").optional(),
  })
  .strict();

export const updateArtistSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    bio: z.string().optional().nullable(),
    image: z.string().url().optional().nullable(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// GENRE VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const genreSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().optional().nullable(),
    createdAt: z.date(),
  })
  .strict();

export const createGenreSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().optional(),
  })
  .strict();

export const updateGenreSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional().nullable(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// TYPE VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const typeSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().optional().nullable(),
    createdAt: z.date(),
  })
  .strict();

export const createTypeSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().optional(),
  })
  .strict();

export const updateTypeSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional().nullable(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// BOOKMARK VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const bookmarkSchema = z
  .object({
    userId: z.string().uuid(),
    comicId: z.number().int().positive(),
    lastReadChapterId: z.number().int().positive().optional().nullable(),
    notes: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const createBookmarkSchema = z
  .object({
    comicId: z.number().int().positive("Comic ID is required"),
    lastReadChapterId: z.number().int().positive().optional(),
    notes: z.string().optional(),
  })
  .strict();

export const updateBookmarkSchema = z
  .object({
    lastReadChapterId: z.number().int().positive().optional().nullable(),
    notes: z.string().optional().nullable(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// COMMENT VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const commentSchema = z
  .object({
    id: z.number().int().positive(),
    content: z.string().min(1, "Content is required"),
    userId: z.string().uuid(),
    chapterId: z.number().int().positive(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const createCommentSchema = z
  .object({
    content: z.string().min(1, "Content is required").max(1000),
    chapterId: z.number().int().positive("Chapter ID is required"),
  })
  .strict();

export const updateCommentSchema = z
  .object({
    content: z.string().min(1).max(1000).optional(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// CHAPTER IMAGE VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const chapterImageSchema = z
  .object({
    id: z.number().int().positive(),
    chapterId: z.number().int().positive(),
    imageUrl: z.string().url("Invalid image URL"),
    pageNumber: z.number().int().positive(),
    createdAt: z.date(),
  })
  .strict();

export const createChapterImageSchema = z
  .object({
    chapterId: z.number().int().positive("Chapter ID is required"),
    imageUrl: z.string().url("Invalid image URL"),
    pageNumber: z.number().int().positive("Page number must be positive"),
  })
  .strict();

export const updateChapterImageSchema = z
  .object({
    imageUrl: z.string().url().optional(),
    pageNumber: z.number().int().positive().optional(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// COMIC IMAGE VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const comicImageSchema = z
  .object({
    id: z.number().int().positive(),
    comicId: z.number().int().positive(),
    imageUrl: z.string().url("Invalid image URL"),
    imageOrder: z.number().int().nonnegative(),
    createdAt: z.date(),
  })
  .strict();

export const createComicImageSchema = z
  .object({
    comicId: z.number().int().positive("Comic ID is required"),
    imageUrl: z.string().url("Invalid image URL"),
    imageOrder: z.number().int().nonnegative("Image order must be non-negative"),
  })
  .strict();

export const updateComicImageSchema = z
  .object({
    imageUrl: z.string().url().optional(),
    imageOrder: z.number().int().nonnegative().optional(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// PAGINATION & FILTER SCHEMAS
// ═══════════════════════════════════════════════════

export const paginationSchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
  })
  .strict();

export const comicFiltersSchema = paginationSchema.extend({
  search: z.string().optional(),
  typeId: z.coerce.number().int().positive().optional(),
  genreIds: z.array(z.coerce.number().int().positive()).optional(),
  status: z.enum(["Ongoing", "Hiatus", "Completed", "Dropped", "Coming Soon"]).optional(),
  minRating: z.coerce.number().min(0).max(10).optional(),
  sortBy: z.enum(["latest", "rating", "title", "views"]).default("latest"),
});

// ═══════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type VerifyEmail = z.infer<typeof verifyEmailSchema>;

export type Comic = z.infer<typeof comicSchema>;
export type CreateComic = z.infer<typeof createComicSchema>;
export type UpdateComic = z.infer<typeof updateComicSchema>;

export type Chapter = z.infer<typeof chapterSchema>;
export type CreateChapter = z.infer<typeof createChapterSchema>;
export type UpdateChapter = z.infer<typeof updateChapterSchema>;

export type Author = z.infer<typeof authorSchema>;
export type CreateAuthor = z.infer<typeof createAuthorSchema>;
export type UpdateAuthor = z.infer<typeof updateAuthorSchema>;

export type Artist = z.infer<typeof artistSchema>;
export type CreateArtist = z.infer<typeof createArtistSchema>;
export type UpdateArtist = z.infer<typeof updateArtistSchema>;

export type Genre = z.infer<typeof genreSchema>;
export type CreateGenre = z.infer<typeof createGenreSchema>;
export type UpdateGenre = z.infer<typeof updateGenreSchema>;

export type Type = z.infer<typeof typeSchema>;
export type CreateType = z.infer<typeof createTypeSchema>;
export type UpdateType = z.infer<typeof updateTypeSchema>;

export type Bookmark = z.infer<typeof bookmarkSchema>;
export type CreateBookmark = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmark = z.infer<typeof updateBookmarkSchema>;

export type Comment = z.infer<typeof commentSchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;

export type ChapterImage = z.infer<typeof chapterImageSchema>;
export type CreateChapterImage = z.infer<typeof createChapterImageSchema>;
export type UpdateChapterImage = z.infer<typeof updateChapterImageSchema>;

export type ComicImage = z.infer<typeof comicImageSchema>;
export type CreateComicImage = z.infer<typeof createComicImageSchema>;
export type UpdateComicImage = z.infer<typeof updateComicImageSchema>;

export type Pagination = z.infer<typeof paginationSchema>;
export type ComicFilters = z.infer<typeof comicFiltersSchema>;
