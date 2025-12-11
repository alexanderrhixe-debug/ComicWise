#!/usr/bin/env bash
set -euo pipefail

# Build the project
if command -v pnpm >/dev/null 2>&1; then
  pnpm build
else
  npm run build
fi

echo "Build finished."
