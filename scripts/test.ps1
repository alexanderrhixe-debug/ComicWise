<#
.SYNOPSIS
  Run tests (PowerShell)
#>
param(
  [switch]$Watch
)

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
  if ($Watch) { pnpm test -- --watch } else { pnpm test }
} else {
  if ($Watch) { npm test -- --watch } else { npm test }
}

Write-Output "Tests finished."
