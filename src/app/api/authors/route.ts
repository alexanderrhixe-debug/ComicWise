// ═══════════════════════════════════════════════════
// AUTHORS API - Full CRUD
// ═══════════════════════════════════════════════════

import {
  createGenericEntity,
  listGenericEntity,
  zodToValidationResult,
} from "lib/generic-crud";
import { createAuthor } from "database/mutations/authors";
import { getAllAuthors } from "database/queries/authors";
import { authorFilterSchema, createAuthorSchema } from "lib/validations/schemas";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return listGenericEntity(request, {
    listFn: getAllAuthors,
    validateFn: zodToValidationResult(authorFilterSchema),
    entityName: "authors",
  });
}

export async function POST(request: NextRequest) {
  return createGenericEntity(request, {
    createFn: createAuthor,
    validateFn: zodToValidationResult(createAuthorSchema),
    entityName: "author",
  });
}
