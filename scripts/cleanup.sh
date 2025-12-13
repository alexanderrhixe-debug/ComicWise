#!/usr/bin/env bash
set -euo pipefail

# Cleanup dev artifacts: node_modules, .next, out, dist, .turbo
CLEAN_NODE_MODULES=false
if [[ ${1-} == "--node-modules" ]]; then CLEAN_NODE_MODULES=true; fi

echo "[scripts/cleanup.sh] Cleaning build artifacts..."
rm -rf .next .parcel-cache dist out .turbo build

if $CLEAN_NODE_MODULES; then
  echo "Removing node_modules and lockfiles..."
  rm -rf node_modules pnpm-lock.yaml package-lock.json yarn.lock
fi

echo "Cleanup complete."
