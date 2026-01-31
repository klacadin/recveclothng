# PowerShell script to help deploy Supabase Edge Functions
# This script provides the function code for easy copy-paste to Supabase Dashboard

$functions = @(
    "send-otp",          # Required for checkout OTP verification
    "verify-otp",        # Required for checkout OTP verification
    "create-order",      # Required for order creation
    "create-xendit-payment",
    "xendit-webhook",
    "send-order-email",
    "notify-payment-proof"
)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Supabase Edge Functions Deployment Helper" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project ID: txiwvjfdlxgwjtaibbpb" -ForegroundColor Yellow
Write-Host ""
Write-Host "Functions to deploy:" -ForegroundColor Green
foreach ($func in $functions) {
    Write-Host "  - $func" -ForegroundColor White
}
Write-Host ""
Write-Host "Deployment URL:" -ForegroundColor Green
Write-Host "https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/functions" -ForegroundColor Cyan
Write-Host ""
Write-Host "For each function:" -ForegroundColor Yellow
Write-Host "1. Click 'Deploy new function'" -ForegroundColor White
Write-Host "2. Name it: [function-name]" -ForegroundColor White
Write-Host "3. Copy code from: supabase/functions/[function-name]/index.ts" -ForegroundColor White
Write-Host "4. Paste and deploy" -ForegroundColor White
Write-Host ""

