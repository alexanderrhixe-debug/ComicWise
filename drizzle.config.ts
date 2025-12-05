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

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
  verbose: true,
  strict: true,
});
