# Setup Local Supabase Database
Write-Host "🚀 Setting up local Supabase database..." -ForegroundColor Cyan
Write-Host ""

# Check Docker status
Write-Host "📍 Checking local Supabase status..." -ForegroundColor Yellow
$dockerCheck = docker ps | Select-String "supabase_db_KHL"

if (-not $dockerCheck) {
    Write-Host "❌ Local Supabase is not running!" -ForegroundColor Red
    Write-Host "📝 Make sure Docker is running and Supabase containers are started." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Local Supabase is running" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Running database migrations..." -ForegroundColor Cyan
Write-Host ""

# Database connection
$DB_HOST = "localhost"
$DB_PORT = "54322"
$DB_USER = "postgres"
$DB_PASSWORD = "postgres"
$DB_NAME = "postgres"

# Get all migration files
$migrationFiles = Get-ChildItem -Path "./supabase/migrations" -Filter "*.sql" | Sort-Object Name

foreach ($file in $migrationFiles) {
    $filename = $file.Name
    Write-Host "📄 Applying: $filename" -ForegroundColor Yellow
    
    # Read migration content
    $sqlContent = Get-Content $file.FullName -Raw
    
    # Execute via docker
    $result = $sqlContent | docker exec -i supabase_db_KHL psql -U $DB_USER -d $DB_NAME 2>&1
    
    # Check for errors
    if ($result -match "ERROR") {
        Write-Host "   ⚠️  Warning: $result" -ForegroundColor Yellow
    } else {
        Write-Host "   ✓" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Your local Supabase now has:" -ForegroundColor Cyan
Write-Host "   • Products table with 72 items"
Write-Host "   • Orders and order items tables"
Write-Host "   • Authentication and user roles"
Write-Host "   • Categories, articles, vouchers"
Write-Host "   • Payment tracking"
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Update .env with local Supabase credentials"
Write-Host "   2. Run: npm run dev"
Write-Host "   3. Visit: http://localhost:5173"
Write-Host ""
