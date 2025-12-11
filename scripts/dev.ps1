<#
.SYNOPSIS
  Start the development server.
#>

param()

if (Get-Command pnpm -ErrorAction SilentlyContinue) { pnpm dev } else { npm run dev }
