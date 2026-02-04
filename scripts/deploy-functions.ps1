# Deploy Supabase Edge Functions from a temp copy on C: to avoid Docker path issues on Windows
# when the project lives on another drive (e.g. X:).
# Usage: .\scripts\deploy-functions.ps1 [function-name]
#        .\scripts\deploy-functions.ps1   (deploys get-pending-order and upload-order-proof)

$ErrorActionPreference = "Stop"
# Prefer repo root when script is run from repo; else use script's parent (e.g. when run from IDE temp)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
if (-not (Test-Path (Join-Path $projectRoot "supabase\config.toml"))) {
  $projectRoot = Get-Location
}
if (-not (Test-Path (Join-Path $projectRoot "supabase\config.toml"))) {
  Write-Error "Project root not found (expected supabase\config.toml). Run from repo or use project root."
}
$dest = Join-Path $env:TEMP "supabase-deploy-recve"

if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item -Path (Join-Path $projectRoot "supabase") -Destination $dest -Recurse -Force

Push-Location $dest
try {
  if ($args.Count -gt 0) {
    foreach ($name in $args) {
      Write-Host "Deploying $name..."
      npx supabase functions deploy $name
    }
  } else {
    Write-Host "Deploying get-pending-order..."
    npx supabase functions deploy get-pending-order
    Write-Host "Deploying upload-order-proof..."
    npx supabase functions deploy upload-order-proof
  }
} finally {
  Pop-Location
}

Write-Host "Done. You can remove the temp folder: $dest"
