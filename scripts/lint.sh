#!/usr/bin/env bash
set -euo pipefail

# Run linter (pnpm prefered)
CI=false
if [[ ${1-} == "--ci" ]]; then CI=true; fi

if command -v pnpm >/dev/null 2>&1; then
  if $CI; then
    pnpm lint -- --max-warnings=0
  else
    pnpm lint
  fi
else
  if $CI; then
    npm run lint --silent -- --max-warnings=0
  else
    npm run lint
  fi
fi

echo "Lint finished."
