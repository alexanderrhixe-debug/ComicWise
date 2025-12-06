// ═══════════════════════════════════════════════════
// TYPE DETAIL API
// ═══════════════════════════════════════════════════

import { NextRequest } from "next/server";

import { deleteType, updateType } from "@/db/mutations/types";
import { getTypeById } from "@/db/queries/types";
import { typeIdSchema, updateTypeSchema } from "@/lib/validations/schemas";

import {
  deleteGenericEntity,
  getGenericEntity,
  updateGenericEntity,
  zodToValidationResult,
} from "@/app/api/lib/generic-crud";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getGenericEntity(id, {
    getFn: getTypeById,
    validateFn: zodToValidationResult(typeIdSchema),
    entityName: "type",
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  return updateGenericEntity(id, body, {
    updateFn: updateType,
    idValidateFn: zodToValidationResult(typeIdSchema),
    dataValidateFn: zodToValidationResult(updateTypeSchema),
    entityName: "type",
  });
}

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return deleteGenericEntity(id, {
    deleteFn: deleteType,
    validateFn: typeIdSchema.safeParse.bind(typeIdSchema),
    entityName: "type",
  });
}
