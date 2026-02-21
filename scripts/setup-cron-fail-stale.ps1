# Setup Cron: Auto-fail pending_payment orders after 2 hours
# Run this AFTER enabling Cron in Supabase Dashboard (Integrations → Cron)

param(
    [string]$ProjectRef = "txiwvjfdlxgwjtaibbpb"
)

Write-Host "Setting up fail-stale-pending-payments cron job..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Step 1: Enable Cron in Supabase Dashboard" -ForegroundColor Yellow
Write-Host "  Go to: https://supabase.com/dashboard/project/$ProjectRef/integrations" -ForegroundColor Gray
Write-Host "  Click 'Cron' under Integrations and enable it." -ForegroundColor Gray
Write-Host ""
Write-Host "Step 2: Run the cron migration" -ForegroundColor Yellow
Write-Host "  After enabling Cron, run:" -ForegroundColor Gray
Write-Host "  npx supabase db push --linked" -ForegroundColor White
Write-Host ""
Write-Host "  Or run in Dashboard → SQL Editor:" -ForegroundColor Gray
Write-Host "  SELECT cron.schedule('fail-stale-pending-payments', '*/15 * * * *', " -ForegroundColor DarkGray
Write-Host "    `$`$UPDATE public.orders SET status = 'failed', updated_at = now() WHERE status = 'pending_payment' AND created_at < now() - interval '2 hours'`$`$);" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Verify: Dashboard → Integrations → Cron → Jobs" -ForegroundColor Cyan
