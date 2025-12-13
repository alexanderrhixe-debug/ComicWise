#!/usr/bin/env bash
set -euo pipefail

# Run test suite
if command -v pnpm >/dev/null 2>&1; then
  pnpm test
else
  npm test
fi

echo "Tests finished."
