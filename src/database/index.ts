// Central database entrypoint — provides convenient named exports for imports like `from "database"`
export * from "database/db";
export * from "src/database/schema";

import type { Database as DrizzleDatabase, Schema as DrizzleSchema } from "database/db";
import { db } from "database/db";
import * as schema from "database/schema";

// Provide a `database` named export (many files import { database, ... } )
// Keep runtime exports permissive (`any`) for incremental typing work to
// avoid a large, noisy type regression across many files. We still
// re-export the accurate `Database` and `Schema` types for consumers who
// want to opt into strict Drizzle typing.
export const database: any = db;

// Also export a simple object containing schema tables for convenience
export const tables: any = schema;

// Re-export the concrete Database and Schema types from the DB implementation
export type Database = DrizzleDatabase;
export type Schema = DrizzleSchema;
