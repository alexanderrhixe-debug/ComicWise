-- Add slug columns as nullable first
ALTER TABLE "chapter" ADD COLUMN IF NOT EXISTS "slug" text;--> statement-breakpoint
ALTER TABLE "comic" ADD COLUMN IF NOT EXISTS "slug" text;--> statement-breakpoint

-- Backfill slugs using a safe fallback based on id when titles are missing
UPDATE "comic" SET "slug" = ('comic-' || "id") WHERE "slug" IS NULL OR "slug" = '';
UPDATE "chapter" SET "slug" = ('chapter-' || "id") WHERE "slug" IS NULL OR "slug" = '';

-- Enforce NOT NULL now that values exist
ALTER TABLE "chapter" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comic" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint

-- Create indexes and unique constraint
CREATE INDEX IF NOT EXISTS "chapter_slug_idx" ON "chapter" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comic_slug_idx" ON "comic" USING btree ("slug");--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'comic_slug_unique'
	) THEN
		ALTER TABLE "comic" ADD CONSTRAINT "comic_slug_unique" UNIQUE("slug");
	END IF;
END
$$;