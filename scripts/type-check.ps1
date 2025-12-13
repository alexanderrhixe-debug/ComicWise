<#
.SYNOPSIS
  Run TypeScript type checks
#>
param()

if (Get-Command pnpm -ErrorAction SilentlyContinue) { pnpm type-check } else { npm run type-check }
Write-Output "Type-check finished."
