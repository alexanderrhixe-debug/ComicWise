<#
.SYNOPSIS
  Run the production server (after `build`).
#>
param()

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
  try { pnpm start; exit $LASTEXITCODE } catch { }
  try { pnpm preview; exit $LASTEXITCODE } catch { }
  try { pnpm run start; exit $LASTEXITCODE } catch { }
}

try { npm run start } catch { npm run preview }
