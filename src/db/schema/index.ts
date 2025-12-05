import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ═══════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════

export const userRole = pgEnum("user_role", ["user", "admin", "moderator"]);
export const comicStatus = pgEnum("comic_status", [
  "Ongoing",
  "Hiatus",
  "Completed",
  "Dropped",
  "Coming Soon",
]);

// ═══════════════════════════════════════════════════
// AUTHENTICATION TABLES
// ═══════════════════════════════════════════════════

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  })
);

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.identifier, table.token] }),
  })
);

export const authenticator = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.credentialID] }),
  })
);

export const passwordResetToken = pgTable("passwordResetToken", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ═══════════════════════════════════════════════════
// COMIC CONTENT TABLES
// ═══════════════════════════════════════════════════

export const type = pgTable("type", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const author = pgTable("author", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const artist = pgTable("artist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const genre = pgTable("genre", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const comic = pgTable("comic", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  coverImage: text("coverImage").notNull(),
  status: comicStatus("status").default("Ongoing").notNull(),
  publicationDate: timestamp("publicationDate", { mode: "date" }).notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
  views: integer("views").default(0).notNull(),
  authorId: integer("authorId").references(() => author.id),
  artistId: integer("artistId").references(() => artist.id),
  typeId: integer("typeId").references(() => type.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const chapter = pgTable("chapter", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  chapterNumber: integer("chapter_number").notNull(),
  releaseDate: timestamp("release_date", { mode: "date" }).notNull(),
  comicId: integer("comic_id")
    .references(() => comic.id, { onDelete: "cascade" })
    .notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const comicImage = pgTable("comicImage", {
  id: serial("id").primaryKey(),
  comicId: integer("comic_id")
    .references(() => comic.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageOrder: integer("imageOrder").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const chapterImage = pgTable("chapterImage", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id")
    .references(() => chapter.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("imageUrl").notNull(),
  pageNumber: integer("pageNumber").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const comicToGenre = pgTable(
  "comicToGenre",
  {
    comicId: integer("comic_id")
      .references(() => comic.id, { onDelete: "cascade" })
      .notNull(),
    genreId: integer("genre_id")
      .references(() => genre.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.comicId, table.genreId] }),
  })
);

// ═══════════════════════════════════════════════════
// USER INTERACTION TABLES
// ═══════════════════════════════════════════════════

export const bookmark = pgTable(
  "bookmark",
  {
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    comicId: integer("comic_id")
      .references(() => comic.id, { onDelete: "cascade" })
      .notNull(),
    lastReadChapterId: integer("last_read_chapter_id").references(() => chapter.id),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.comicId] }),
  })
);

export const comment = pgTable("comment", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  chapterId: integer("chapter_id")
    .references(() => chapter.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
