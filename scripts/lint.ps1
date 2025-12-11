<#
.SYNOPSIS
  Run linter (PowerShell)
#>
param(
  [switch]$CI
)

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
  if ($CI) { pnpm lint -- --max-warnings=0 } else { pnpm lint }
}
else {
  if ($CI) { npm run lint --silent -- --max-warnings=0 } else { npm run lint }
}

Write-Output "Lint finished."
