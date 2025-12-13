#!/usr/bin/env bash
set -euo pipefail

# Setup script: installs deps, runs type-check, and prints next steps

echo "[scripts/setup.sh] Starting project setup"

DETECT_PNPM=false
if command -v pnpm >/dev/null 2>&1; then
  DETECT_PNPM=true
  PM_CMD="pnpm"
  INSTALL_CMD="pnpm install"
else
  PM_CMD="npm"
  INSTALL_CMD="npm ci"
fi

echo "Using: $PM_CMD"
$INSTALL_CMD

# Run basic checks
if command -v pnpm >/dev/null 2>&1; then
  echo "Running type-check with pnpm..."
  pnpm type-check || echo "Type-check failed (you can run 'pnpm type-check' locally)."
else
  echo "Run 'npm run type-check' if available to verify types."
fi

echo "Setup complete. Next steps: \n - Copy .env.example to .env and fill secrets.\n - Run './scripts/dev.sh' or 'pwsh ./scripts/dev.ps1' to start development."
