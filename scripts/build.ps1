<#
.SYNOPSIS
  Build project for production
#>
param()

if (Get-Command pnpm -ErrorAction SilentlyContinue) { pnpm build } else { npm run build }
Write-Output "Build finished."
