// ═══════════════════════════════════════════════════
// TYPES API - Full CRUD
// ═══════════════════════════════════════════════════

import { NextRequest } from "next/server";

import { createType } from "@/db/mutations/types";
import { getAllTypes } from "@/db/queries/types";
import { createTypeSchema, typeFilterSchema } from "@/lib/validations/schemas";

import {
  createGenericEntity,
  listGenericEntity,
  zodToValidationResult,
} from "@/app/api/lib/generic-crud";

export async function GET(request: NextRequest) {
  return listGenericEntity(request, {
    listFn: getAllTypes,
    validateFn: zodToValidationResult(typeFilterSchema),
    entityName: "types",
  });
}

export async function POST(request: NextRequest) {
  return createGenericEntity(request, {
    createFn: createType,
    validateFn: zodToValidationResult(createTypeSchema),
    entityName: "type",
  });
}
