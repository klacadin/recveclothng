# Set Facebook secrets for Supabase Edge Function (fetch-facebook-posts)
# Usage: .\scripts\set-facebook-secrets.ps1
# Requires: Supabase CLI, Facebook App with Page Access Token

$ErrorActionPreference = "Stop"

$projectRef = "txiwvjfdlxgwjtaibbpb"

# Facebook Page ID or username (e.g. ReveClothingBukidnon or numeric page ID)
$pageId = Read-Host "Enter Facebook Page ID or username (e.g. ReveClothingBukidnon)"
$accessToken = Read-Host "Enter Facebook Page Access Token" -AsSecureString
$tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($accessToken))

Write-Host "Setting Facebook secrets for project: $projectRef" -ForegroundColor Cyan

npx supabase secrets set FACEBOOK_PAGE_ID=$pageId --project-ref $projectRef
npx supabase secrets set "FACEBOOK_ACCESS_TOKEN=$tokenPlain" --project-ref $projectRef

Write-Host ""
Write-Host "Facebook secrets configured!" -ForegroundColor Green
Write-Host "To get a Page Access Token: https://developers.facebook.com/tools/explorer/"
Write-Host "  - Select your App"
Write-Host "  - Add 'pages_read_engagement' and 'pages_show_list' permissions"
Write-Host "  - Generate token, then use 'Page Access Token' for your page"
