#!/usr/bin/env bash
set -euo pipefail

# Start development server (Next.js) using pnpm or npm

if command -v pnpm >/dev/null 2>&1; then
  exec pnpm dev
else
  exec npm run dev
fi
