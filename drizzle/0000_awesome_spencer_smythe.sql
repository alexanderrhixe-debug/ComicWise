CREATE TYPE "public"."comic_status" AS ENUM('Ongoing', 'Hiatus', 'Completed', 'Dropped', 'Coming Soon');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'moderator');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "artist" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "author" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmark" (
	"user_id" text NOT NULL,
	"comic_id" integer NOT NULL,
	"last_read_chapter_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmark_user_id_comic_id_pk" PRIMARY KEY("user_id","comic_id")
);
--> statement-breakpoint
CREATE TABLE "chapter" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"chapter_number" integer NOT NULL,
	"release_date" timestamp NOT NULL,
	"comic_id" integer NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapterImage" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL,
	"imageUrl" text NOT NULL,
	"pageNumber" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comic" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"coverImage" text NOT NULL,
	"status" "comic_status" DEFAULT 'Ongoing' NOT NULL,
	"publicationDate" timestamp NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0',
	"views" integer DEFAULT 0 NOT NULL,
	"authorId" integer,
	"artistId" integer,
	"typeId" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comicImage" (
	"id" serial PRIMARY KEY NOT NULL,
	"comic_id" integer NOT NULL,
	"imageUrl" text NOT NULL,
	"imageOrder" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comicToGenre" (
	"comic_id" integer NOT NULL,
	"genre_id" integer NOT NULL,
	CONSTRAINT "comicToGenre_comic_id_genre_id_pk" PRIMARY KEY("comic_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"user_id" text NOT NULL,
	"chapter_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genre" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "genre_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "passwordResetToken" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "passwordResetToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_comic_id_comic_id_fk" FOREIGN KEY ("comic_id") REFERENCES "public"."comic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_last_read_chapter_id_chapter_id_fk" FOREIGN KEY ("last_read_chapter_id") REFERENCES "public"."chapter"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_comic_id_comic_id_fk" FOREIGN KEY ("comic_id") REFERENCES "public"."comic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapterImage" ADD CONSTRAINT "chapterImage_chapter_id_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapter"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comic" ADD CONSTRAINT "comic_authorId_author_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."author"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comic" ADD CONSTRAINT "comic_artistId_artist_id_fk" FOREIGN KEY ("artistId") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comic" ADD CONSTRAINT "comic_typeId_type_id_fk" FOREIGN KEY ("typeId") REFERENCES "public"."type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comicImage" ADD CONSTRAINT "comicImage_comic_id_comic_id_fk" FOREIGN KEY ("comic_id") REFERENCES "public"."comic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comicToGenre" ADD CONSTRAINT "comicToGenre_comic_id_comic_id_fk" FOREIGN KEY ("comic_id") REFERENCES "public"."comic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comicToGenre" ADD CONSTRAINT "comicToGenre_genre_id_genre_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genre"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_chapter_id_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapter"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;