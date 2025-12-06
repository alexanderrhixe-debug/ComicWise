// ═══════════════════════════════════════════════════
// AUTH MUTATIONS
// ═══════════════════════════════════════════════════
export * from "@/db/mutations/accounts";
export * from "@/db/mutations/authenticators";
export * from "@/db/mutations/passwordResetToken";
export * from "@/db/mutations/sessions";
export * from "@/db/mutations/verificationTokens";

// ═══════════════════════════════════════════════════
// USER MUTATIONS
// ═══════════════════════════════════════════════════
export * from "@/db/mutations/users";

// ═══════════════════════════════════════════════════
// COMIC CONTENT MUTATIONS
// ═══════════════════════════════════════════════════
export * from "@/db/mutations/artists";
export * from "@/db/mutations/authors";
export * from "@/db/mutations/chapterImages";
export {
  addChapterImage,
  addChapterImages,
  createChapter,
  deleteChapter,
  incrementChapterViews,
  updateChapter,
} from "@/db/mutations/chapters";
export * from "@/db/mutations/comicImages";
export * from "@/db/mutations/comics";
export * from "@/db/mutations/comicToGenre";
export * from "@/db/mutations/genres";
export * from "@/db/mutations/types";

// ═══════════════════════════════════════════════════
// INTERACTION MUTATIONS
// ═══════════════════════════════════════════════════
export * from "@/db/mutations/bookmarks";
export * from "@/db/mutations/comments";
