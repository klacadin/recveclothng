# Set Xendit secrets for Supabase Edge Functions
# Usage: .\scripts\set-xendit-secrets.ps1
# Requires: Supabase CLI installed and authenticated

$ErrorActionPreference = "Stop"

$projectRef = "txiwvjfdlxgwjtaibbpb"

# Xendit Production Secret Key
$secretKey = "xnd_production_ZmnuUjwuD2KYcMuJCtKFSUmuTipOQOVkkMOCj5v9JN7S98C3b7gqqvduGFO"

# Xendit Webhook Token
$webhookToken = "DGu3SUTaRBMDQcuMv4luTuJNlVfj3tIfgrwf6vWyOveMgUP5"

Write-Host "Setting Xendit secrets for project: $projectRef" -ForegroundColor Cyan

# Set secret for create-xendit-payment function
Write-Host ""
Write-Host "Setting XENDIT_SECRET_KEY for create-xendit-payment..." -ForegroundColor Yellow
npx supabase secrets set XENDIT_SECRET_KEY=$secretKey --project-ref $projectRef

# Set webhook token for xendit-webhook function
Write-Host ""
Write-Host "Setting XENDIT_WEBHOOK_TOKEN for xendit-webhook..." -ForegroundColor Yellow
npx supabase secrets set XENDIT_WEBHOOK_TOKEN=$webhookToken --project-ref $projectRef

# Optional: Set APP_URL for redirect URLs
$appUrl = "https://reveclothingxnobody.com"
Write-Host ""
Write-Host "Setting APP_URL for redirect URLs..." -ForegroundColor Yellow
npx supabase secrets set APP_URL=$appUrl --project-ref $projectRef

Write-Host ""
Write-Host "Xendit secrets configured successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify secrets in Supabase Dashboard: https://supabase.com/dashboard/project/$projectRef/settings/functions"
Write-Host "2. Configure webhook in Xendit Dashboard: https://dashboard.xendit.co/settings/webhooks"
$webhookUrl = "https://$projectRef.supabase.co/functions/v1/xendit-webhook"
Write-Host "   Webhook URL: $webhookUrl"
Write-Host "3. Deploy edge functions if needed: .\scripts\deploy-functions.ps1 create-xendit-payment xendit-webhook"
