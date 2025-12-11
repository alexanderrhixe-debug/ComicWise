<#
.SYNOPSIS
  Run Prettier formatting
#>
param()

if (Get-Command pnpm -ErrorAction SilentlyContinue) { pnpm format } else { npm run format }
Write-Output "Format complete."
