<#
.SYNOPSIS
  Project setup: installs dependencies and runs basic checks.
#>

param()

function Detect-Pkg {
  if (Get-Command pnpm -ErrorAction SilentlyContinue) { return 'pnpm' }
  if (Get-Command npm -ErrorAction SilentlyContinue) { return 'npm' }
  return $null
}

$pkg = Detect-Pkg
if (-not $pkg) {
  Write-Error "No pnpm or npm found. Please install Node.js and pnpm or npm."
  exit 1
}
Write-Output "Using package manager: $pkg"

if ($pkg -eq 'pnpm') { pnpm install } else { npm ci }

try { pnpm run type-check } catch { Write-Output "Type-check not configured or failed. Run manually if needed." }

Write-Output "Setup complete. Copy '.env.example' to '.env' and fill secrets. Run './scripts/dev.sh' or 'pwsh ./scripts/dev.ps1' to start dev."
