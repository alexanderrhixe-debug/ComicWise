#!/usr/bin/env bash
set -euo pipefail

# Run code formatter (Prettier)
if command -v pnpm >/dev/null 2>&1; then
  pnpm format || true
else
  npm run format || true
fi

echo "Format complete."
