// ═══════════════════════════════════════════════════
// GENRES API - Full CRUD
// ═══════════════════════════════════════════════════

import { NextRequest } from "next/server";

import { createGenre } from "@/db/mutations/genres";
import { getAllGenres } from "@/db/queries/genres";
import { createGenreSchema, genreFilterSchema } from "@/lib/validations/schemas";

import {
  createGenericEntity,
  listGenericEntity,
  zodToValidationResult,
} from "@/app/api/lib/generic-crud";

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
