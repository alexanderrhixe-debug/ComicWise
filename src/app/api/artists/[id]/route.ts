// ═══════════════════════════════════════════════════
// ARTIST DETAIL API
// ═══════════════════════════════════════════════════

import { NextRequest } from "next/server";

import { deleteArtist, updateArtist } from "@/db/mutations/artists";
import { getArtistById } from "@/db/queries/artists";
import { artistIdSchema, updateArtistSchema } from "@/lib/validations/schemas";

import {
  deleteGenericEntity,
  getGenericEntity,
  updateGenericEntity,
  zodToValidationResult,
} from "@/app/api/lib/generic-crud";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getGenericEntity(id, {
    getFn: getArtistById,
    validateFn: zodToValidationResult(artistIdSchema),
    entityName: "artist",
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  return updateGenericEntity(id, body, {
    updateFn: updateArtist,
    idValidateFn: zodToValidationResult(artistIdSchema),
    dataValidateFn: zodToValidationResult(updateArtistSchema),
    entityName: "artist",
  });
}

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return deleteGenericEntity(id, {
    deleteFn: deleteArtist,
    validateFn: zodToValidationResult(artistIdSchema),
    entityName: "artist",
  });
}
