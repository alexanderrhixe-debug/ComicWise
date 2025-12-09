// Central database entrypoint — provides convenient named exports for imports like `from "database"`
export * from "src/database/db";
export * from "src/database/schema";

import { db } from "src/database/db";
import * as schema from "src/database/schema";

// Provide a `database` named export (many files import { database, ... } )
export const database = db;

// Also export a simple object containing schema tables for convenience
export const tables = schema;

export type { Database } from "src/database/db";
