import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Get DATABASE_URL with fallback
const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL or NEON_DATABASE_URL must be defined in environment variables");
  }
  return url;
};

const cfg = {
  schema: "./src/database/schema.ts",
  out: "./src/database/drizzle",
  dialect: "postgresql",
  // drizzle-kit typings differ across versions; keep flexible here
  // `databaseCredentials` is used at runtime but may not be in the d.ts
  databaseCredentials: {
    url: getDatabaseUrl(),
  },
  verbose: true,
  strict: true,
} as any;

export default defineConfig(cfg);
