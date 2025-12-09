/**
 * User Seeder
 */

import { appConfig } from "app-config";
import bcrypt from "bcryptjs";
import { db } from "db/client";
import { user } from "db/schema";
import { ProgressTracker } from "db/seed/logger";
import { BatchProcessor } from "db/seed/utils/batch-processor";
import { imageService } from "services/image.service";

import type { SeedConfig } from "db/seed/config";
import type { UserSeed } from "lib/validations/seed";

export class UserSeeder {
  private options: SeedConfig["options"];
  private batchProcessor: BatchProcessor<UserSeed, void>;

  constructor(options: SeedConfig["options"]) {
    this.options = options;
    this.batchProcessor = new BatchProcessor<UserSeed, void>({
      batchSize: 50,
      concurrency: 5,
    });
  }

  async seed(users: UserSeed[]): Promise<void> {
    const tracker = new ProgressTracker("Users", users.length);

    await this.batchProcessor.process(users, async (userData) => {
      try {
        await this.processUser(userData, tracker);
      } catch (error) {
        tracker.incrementError(`${userData.email}: ${error}`);
      }
    });

    tracker.complete();
  }

  private async processUser(userData: UserSeed, tracker: ProgressTracker): Promise<void> {
    // Check if user exists
    const existing = await db.query.user.findFirst({
      where: eq(user.email, userData.email),
    });

    // Hash password if provided
    let hashedPassword: string | null = null;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    } else if (appConfig.customPassword) {
      hashedPassword = await bcrypt.hash(appConfig.customPassword, 10);
    }

    // Process image
    let processedImage: string | null = null;
    if (userData.image && !this.options.skipImageDownload) {
      processedImage = await imageService.processImageUrl(userData.image, "avatars");
    }

    if (existing) {
      // Update existing user
      await db
        .update(user)
        .set({
          name: userData.name,
          image: processedImage || existing.image,
          password: hashedPassword || existing.password,
          role: userData.role || existing.role,
          updatedAt: new Date(),
        })
        .where(eq(user.id, existing.id));

      tracker.incrementUpdated(userData.email);
    } else {
      // Create new user
      await db.insert(user).values({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified || null,
        image: processedImage,
        password: hashedPassword,
        role: userData.role || "user",
        createdAt: userData.createdAt || new Date(),
        updatedAt: userData.updatedAt || new Date(),
      });

      tracker.incrementCreated(userData.email);
    }
  }
}
