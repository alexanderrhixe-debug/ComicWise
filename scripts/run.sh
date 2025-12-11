#!/usr/bin/env bash
set -euo pipefail

# Run the built production server (prefers pnpm)
if command -v pnpm >/dev/null 2>&1; then
  if pnpm -v >/dev/null 2>&1; then
    if pnpm start --version >/dev/null 2>&1 2>/dev/null; then
      exec pnpm start
    else
      exec pnpm preview || pnpm start || npm run start
    fi
  fi
else
  exec npm run start || npm run preview
fi
