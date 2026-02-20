# Set HitPay secrets for Supabase Edge Functions
# Usage: .\scripts\set-hitpay-secrets.ps1
#
# Prerequisites:
# 1. Get your HitPay API Key from https://dashboard.hit-pay.com (or sandbox)
# 2. Get your HitPay Webhook Salt from Dashboard > Developers > Webhook Endpoints
#
# Required secrets:
# - HITPAY_API_KEY: Your HitPay Business API Key
# - HITPAY_WEBHOOK_SALT: Salt for webhook signature verification
# - HITPAY_SANDBOX: Set to 'true' for sandbox, omit or 'false' for production

$projectRef = (Get-Content "supabase\.temp\project-ref" -ErrorAction SilentlyContinue) ?? $env:SUPABASE_PROJECT_REF
if (-not $projectRef) {
    Write-Host "Error: Set SUPABASE_PROJECT_REF or run 'supabase link' first" -ForegroundColor Red
    exit 1
}

# Configure these with your HitPay credentials
$apiKey = $env:HITPAY_API_KEY
$webhookSalt = $env:HITPAY_WEBHOOK_SALT

if (-not $apiKey) {
    Write-Host "Error: Set HITPAY_API_KEY environment variable" -ForegroundColor Red
    exit 1
}
if (-not $webhookSalt) {
    Write-Host "Error: Set HITPAY_WEBHOOK_SALT environment variable" -ForegroundColor Red
    exit 1
}

Write-Host "Setting HitPay secrets for project: $projectRef" -ForegroundColor Cyan

Write-Host "Setting HITPAY_API_KEY..." -ForegroundColor Yellow
npx supabase secrets set HITPAY_API_KEY=$apiKey --project-ref $projectRef

Write-Host "Setting HITPAY_WEBHOOK_SALT..." -ForegroundColor Yellow
npx supabase secrets set HITPAY_WEBHOOK_SALT=$webhookSalt --project-ref $projectRef

# Optional: for sandbox testing
if ($env:HITPAY_SANDBOX -eq 'true') {
    Write-Host "Setting HITPAY_SANDBOX=true..." -ForegroundColor Yellow
    npx supabase secrets set HITPAY_SANDBOX=true --project-ref $projectRef
}

Write-Host "HitPay secrets configured successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Register webhook in HitPay Dashboard: Developers > Webhook Endpoints"
$webhookUrl = "https://$projectRef.supabase.co/functions/v1/hitpay-webhook"
Write-Host "   Webhook URL: $webhookUrl"
Write-Host "2. Subscribe to payment_request.completed event"
Write-Host "3. Deploy edge functions: supabase functions deploy create-hitpay-payment hitpay-webhook get-hitpay-payment-status"
