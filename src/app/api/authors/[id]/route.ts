// ═══════════════════════════════════════════════════
// AUTHOR DETAIL API
// ═══════════════════════════════════════════════════

import { NextRequest } from "next/server";

import { deleteAuthor, updateAuthor } from "@/db/mutations/authors";
import { getAuthorById } from "@/db/queries/authors";
import { authorIdSchema, updateAuthorSchema } from "@/lib/validations/schemas";

import {
  deleteGenericEntity,
  getGenericEntity,
  updateGenericEntity,
  zodToValidationResult,
} from "@/app/api/lib/generic-crud";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getGenericEntity(id, {
    getFn: getAuthorById,
    validateFn: zodToValidationResult(authorIdSchema),
    entityName: "author",
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  return updateGenericEntity(id, body, {
    updateFn: updateAuthor,
    idValidateFn: zodToValidationResult(authorIdSchema),
    dataValidateFn: zodToValidationResult(updateAuthorSchema),
    entityName: "author",
  });
}

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return deleteGenericEntity(id, {
    deleteFn: deleteAuthor,
    validateFn: authorIdSchema.safeParse.bind(authorIdSchema),
    entityName: "author",
  });
}
