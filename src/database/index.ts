// Central database entrypoint — provides convenient named exports for imports like `from "database"`
export * from "./db";
export * from "./schema";

import { db } from "./db";
import * as schema from "./schema";

// Provide a `database` named export (many files import { database, ... } )
export const database = db;

// Also export a simple object containing schema tables for convenience
export const tables = schema;

export type { Database } from "./db";
