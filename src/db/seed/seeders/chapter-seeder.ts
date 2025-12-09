/**
 * Chapter Seeder
 */

import { db } from "db/client";
import { chapter, comic } from "db/schema";
import { ProgressTracker } from "db/seed/logger";
import { BatchProcessor } from "db/seed/utils/batch-processor";
import { createSlug, extractChapterNumber, normalizeDate } from "db/seed/utils/helpers";
import { and, eq } from "drizzle-orm";

import type { ChapterSeed } from "@/lib/validations/seed";
import type { SeedConfig } from "db/seed/config";
import { imageService } from "services/image.service";

export class ChapterSeeder {
  private options: SeedConfig["options"];
  private comicCache = new Map<string, number>();
  private batchProcessor: BatchProcessor<ChapterSeed, void>;

  constructor(options: SeedConfig["options"]) {
    this.options = options;
    this.batchProcessor = new BatchProcessor<ChapterSeed, void>({
      batchSize: 100,
      concurrency: 5,
    });
  }

  async seed(chapters: ChapterSeed[]): Promise<void> {
    const tracker = new ProgressTracker("Chapters", chapters.length);

    await this.batchProcessor.process(chapters, async (chapterData) => {
      try {
        await this.processChapter(chapterData, tracker);
      } catch (error) {
        tracker.incrementError(`${chapterData.chaptername || chapterData.title}: ${error}`);
      }
    });

    tracker.complete();
  }

  private async processChapter(chapterData: ChapterSeed, tracker: ProgressTracker): Promise<void> {
    // Get comic ID
    const comicId = await this.getComicId(chapterData);
    if (!comicId) {
      tracker.incrementSkipped("Comic not found");
      return;
    }

    const chapterTitle = chapterData.chaptername || chapterData.title || "Untitled Chapter";
    const chapterNumber = extractChapterNumber(chapterTitle);

    // Check if chapter exists
    const existing = await db.query.chapter.findFirst({
      where: and(eq(chapter.comicId, comicId), eq(chapter.chapterNumber, chapterNumber)),
    });

    // Process page images
    const pageImages: string[] = [];
    if (!this.options.skipImageDownload && chapterData.images) {
      const comicSlug = await this.getComicSlug(comicId);
      const chapterSlug = createSlug(chapterTitle);

      for (let i = 0; i < chapterData.images.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        const img = chapterData.images[i];
        const imageUrl = typeof img === "string" ? img : img?.url || "";
        if (imageUrl) {
          const result = await imageService.processImageUrl(
            imageUrl,
            `comics/${comicSlug}/${chapterSlug}`
          );
          if (result) {
            pageImages.push(result);
          }
        }
      }
    }

    const chapterReleaseDate = normalizeDate(
      chapterData.releaseDate || chapterData.updated_at || chapterData.updatedAt
    );

    if (existing) {
      // Update existing chapter
      await db
        .update(chapter)
        .set({
          title: chapterTitle,
          releaseDate: chapterReleaseDate,
        })
        .where(eq(chapter.id, existing.id));

      tracker.incrementUpdated(chapterTitle);
    } else {
      // Create new chapter
      await db.insert(chapter).values({
        comicId,
        chapterNumber,
        title: chapterTitle,
        releaseDate: chapterReleaseDate,
        views: 0,
      });

      tracker.incrementCreated(chapterTitle);
    }
  }

  private async getComicId(chapterData: ChapterSeed): Promise<number | null> {
    // Extract comic title from different field names
    const comicTitle = chapterData.comictitle || "";

    if (!comicTitle) {
      return null;
    }

    // Check cache first
    if (this.comicCache.has(comicTitle)) {
      return this.comicCache.get(comicTitle) || null;
    }

    // Query database
    const comicRecord = await db.query.comic.findFirst({
      where: eq(comic.title, comicTitle),
    });

    if (comicRecord) {
      this.comicCache.set(comicTitle, comicRecord.id);
      return comicRecord.id;
    }

    return null;
  }

  private async getComicSlug(comicId: number): Promise<string> {
    const comicRecord = await db.query.comic.findFirst({
      where: eq(comic.id, comicId),
    });

    if (!comicRecord) {
      return "unknown";
    }

    return createSlug(comicRecord.title);
  }
}
