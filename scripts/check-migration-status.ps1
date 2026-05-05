# Check migration status and provide next steps

$targetProjectRef = "txiwvjfdlxgwjtaibbpb"
$targetProjectUrl = "https://txiwvjfdlxgwjtaibbpb.supabase.co"
$requiredFunctions = @(
    "send-otp",
    "verify-otp",
    "create-order",
    "create-hitpay-payment",
    "hitpay-webhook",
    "get-hitpay-payment-status",
    "send-order-email",
    "notify-payment-proof"
)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Supabase Migration Status Check" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check config
$configContent = Get-Content "supabase/config.toml" -Raw
if ($configContent -match $targetProjectRef) {
    Write-Host "[OK] supabase/config.toml project ref is updated" -ForegroundColor Green
}
else {
    Write-Host "[ ] supabase/config.toml still points to old project" -ForegroundColor Red
}

# Check .env and .env.example
$envTemplateExists = Test-Path ".env.example"
if ($envTemplateExists) {
    Write-Host "[OK] .env.example exists" -ForegroundColor Green
}
else {
    Write-Host "[ ] .env.example missing" -ForegroundColor Red
}

if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_SUPABASE_URL=$targetProjectUrl") {
        Write-Host "[OK] .env has target VITE_SUPABASE_URL" -ForegroundColor Green
    }
    else {
        Write-Host "[ ] .env missing or outdated VITE_SUPABASE_URL" -ForegroundColor Yellow
        Write-Host "   Expected: VITE_SUPABASE_URL=$targetProjectUrl" -ForegroundColor Gray
    }

    if ($envContent -match "VITE_SUPABASE_PUBLISHABLE_KEY=") {
        Write-Host "[OK] .env has VITE_SUPABASE_PUBLISHABLE_KEY entry" -ForegroundColor Green
    }
    else {
        Write-Host "[ ] .env missing VITE_SUPABASE_PUBLISHABLE_KEY" -ForegroundColor Yellow
    }
}
else {
    Write-Host "[ ] .env not found. Copy from .env.example and fill values." -ForegroundColor Red
}

# Check migration files and required functions
$migrationCount = (Get-ChildItem -Path "supabase/migrations" -File -Filter "*.sql").Count
Write-Host ("[i] Found {0} SQL migration files in supabase/migrations" -f $migrationCount) -ForegroundColor Cyan

$allFunctionsPresent = $true
foreach ($fn in $requiredFunctions) {
    if (Test-Path ("supabase/functions/{0}/index.ts" -f $fn)) {
        Write-Host ("[OK] Function source exists: {0}" -f $fn) -ForegroundColor Green
    }
    else {
        Write-Host ("[ ] Missing function source: {0}" -f $fn) -ForegroundColor Red
        $allFunctionsPresent = $false
    }
}

Write-Host ""
Write-Host "Next Commands (CLI):" -ForegroundColor Yellow
Write-Host "  npx supabase link --project-ref txiwvjfdlxgwjtaibbpb" -ForegroundColor White
Write-Host "  npx supabase db push" -ForegroundColor White
Write-Host "  .\scripts\deploy-functions.ps1" -ForegroundColor White
Write-Host ""

Write-Host "Dashboard Links:" -ForegroundColor Cyan
Write-Host "  Project: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb" -ForegroundColor Blue
Write-Host "  API Settings: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/api" -ForegroundColor Blue
Write-Host "  Functions: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/functions" -ForegroundColor Blue
Write-Host "  SQL Editor: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new" -ForegroundColor Blue
Write-Host ""

if ($allFunctionsPresent) {
    Write-Host "[OK] Function source check complete." -ForegroundColor Green
}
else {
    Write-Host "[ ] Function source check found missing files." -ForegroundColor Red
}

