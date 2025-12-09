// ═══════════════════════════════════════════════════
// GENRES API - Full CRUD
// ═══════════════════════════════════════════════════

import {
  createGenericEntity,
  listGenericEntity,
  zodToValidationResult,
} from "lib/generic-crud";
import { createGenre } from "database/mutations/genres";
import { getAllGenres } from "database/queries/genres";
import { createGenreSchema, genreFilterSchema } from "lib/validations/schemas";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return listGenericEntity(request, {
    listFn: getAllGenres,
    validateFn: zodToValidationResult(genreFilterSchema),
    entityName: "genres",
  });
}

export async function POST(request: NextRequest) {
  return createGenericEntity(request, {
    createFn: createGenre,
    validateFn: zodToValidationResult(createGenreSchema),
    entityName: "genre",
  });
}
