// ═══════════════════════════════════════════════════
// ARTISTS API - Full CRUD
// ═══════════════════════════════════════════════════

import { NextRequest } from "next/server";

import { createArtist } from "@/db/mutations/artists";
import { getAllArtists } from "@/db/queries/artists";
import { artistFilterSchema, createArtistSchema } from "@/lib/validations/schemas";

import {
  createGenericEntity,
  listGenericEntity,
  zodToValidationResult,
} from "@/app/api/lib/generic-crud";

export async function GET(request: NextRequest) {
  return listGenericEntity(request, {
    listFn: getAllArtists,
    validateFn: zodToValidationResult(artistFilterSchema),
    entityName: "artists",
  });
}

export async function POST(request: NextRequest) {
  return createGenericEntity(request, {
    createFn: createArtist,
    validateFn: zodToValidationResult(createArtistSchema),
    entityName: "artist",
  });
}
