# Check migration status and provide next steps

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Supabase Migration Status Check" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check config
$configContent = Get-Content "supabase/config.toml" -Raw
if ($configContent -match "txiwvjfdlxgwjtaibbpb") {
    Write-Host "[OK] Config file updated" -ForegroundColor Green
} else {
    Write-Host "[ ] Config file needs update" -ForegroundColor Red
}

# Check .env
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "txiwvjfdlxgwjtaibbpb") {
        Write-Host "[OK] .env file has new project URL" -ForegroundColor Green
    } else {
        Write-Host "[ ] .env file needs update" -ForegroundColor Yellow
        Write-Host "   Update VITE_SUPABASE_URL to: https://txiwvjfdlxgwjtaibbpb.supabase.co" -ForegroundColor Gray
    }
} else {
    Write-Host "[ ] .env file not found - create it!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Migration Checklist:" -ForegroundColor Yellow
Write-Host "  [ ] Update .env with new credentials" -ForegroundColor White
Write-Host "  [ ] Run 17 database migrations" -ForegroundColor White
Write-Host "  [ ] Deploy 7 edge functions" -ForegroundColor White
Write-Host "  [ ] Configure edge function secrets" -ForegroundColor White
Write-Host ""
Write-Host "Dashboard Links:" -ForegroundColor Cyan
Write-Host "  Project: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb" -ForegroundColor Blue
Write-Host "  API Settings: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/api" -ForegroundColor Blue
Write-Host "  Functions: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/functions" -ForegroundColor Blue
Write-Host "  SQL Editor: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new" -ForegroundColor Blue
Write-Host ""

