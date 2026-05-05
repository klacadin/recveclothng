# Deploy Supabase Edge Functions from a temp copy on C: to avoid Docker path issues on Windows
# when the project lives on another drive (e.g. X:).
# Usage:
#   .\scripts\deploy-functions.ps1                 # deploy required HitPay migration functions
#   .\scripts\deploy-functions.ps1 --all           # deploy all functions in supabase/functions
#   .\scripts\deploy-functions.ps1 fn-a fn-b       # deploy specific functions

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
$requiredMigrationFunctions = @(
  "send-otp",
  "verify-otp",
  "create-order",
  "create-hitpay-payment",
  "hitpay-webhook",
  "get-hitpay-payment-status",
  "send-order-email",
  "notify-payment-proof"
)

if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item -Path (Join-Path $projectRoot "supabase") -Destination $dest -Recurse -Force

Push-Location $dest
try {
  $functionNames = @()

  if ($args.Count -gt 0 -and $args[0] -eq "--all") {
    $functionNames = Get-ChildItem -Path ".\supabase\functions" -Directory | Select-Object -ExpandProperty Name
    Write-Host "Deploy mode: all functions in supabase/functions" -ForegroundColor Cyan
  }
  elseif ($args.Count -gt 0) {
    $functionNames = $args
    Write-Host "Deploy mode: selected functions from arguments" -ForegroundColor Cyan
  }
  else {
    $functionNames = $requiredMigrationFunctions
    Write-Host "Deploy mode: required migration functions" -ForegroundColor Cyan
  }

  foreach ($name in $functionNames) {
    Write-Host "Deploying $name..." -ForegroundColor Yellow
    npx supabase functions deploy $name
  }
}
finally {
  Pop-Location
}

Write-Host "Done. You can remove the temp folder: $dest"
