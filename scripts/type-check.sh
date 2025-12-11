#!/usr/bin/env bash
set -euo pipefail

# Run TypeScript checks
if command -v pnpm >/dev/null 2>&1; then
  pnpm type-check || (echo "Type-check failed"; exit 1)
else
  npm run type-check || (echo "Type-check failed"; exit 1)
fi

echo "Type-check finished."
