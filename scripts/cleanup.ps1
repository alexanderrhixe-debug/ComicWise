<#
.SYNOPSIS
  Cleanup build artifacts and optionally node_modules.
#>
param(
  [switch]$NodeModules
)

Write-Output "Removing build artifacts..."
$paths = @('.next', 'dist', 'out', '.parcel-cache', '.turbo', 'build')
foreach ($p in $paths) { if (Test-Path $p) { Remove-Item -Recurse -Force $p } }

if ($NodeModules) {
  Write-Output "Removing node_modules and lockfiles..."
  if (Test-Path 'node_modules') { Remove-Item -Recurse -Force node_modules }
  foreach ($f in @('pnpm-lock.yaml', 'package-lock.json', 'yarn.lock')) { if (Test-Path $f) { Remove-Item -Force $f } }
}

Write-Output "Cleanup complete."
