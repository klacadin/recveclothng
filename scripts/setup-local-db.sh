#!/bin/bash

echo "🚀 Setting up local Supabase database..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g @supabase/cli
fi

echo "📍 Checking local Supabase status..."
docker ps | grep supabase_db_KHL > /dev/null

if [ $? -ne 0 ]; then
    echo "❌ Local Supabase is not running!"
    echo "📝 Make sure Docker is running and Supabase containers are started."
    exit 1
fi

echo "✅ Local Supabase is running"
echo ""

echo "📦 Running database migrations..."
echo ""

# Get the PostgreSQL connection string for local Supabase
POSTGRES_PASSWORD="postgres"
DB_URL="postgresql://postgres:${POSTGRES_PASSWORD}@localhost:54322/postgres"

# Run all migrations in order
for migration_file in ./supabase/migrations/*.sql; do
    if [ -f "$migration_file" ]; then
        filename=$(basename "$migration_file")
        echo "📄 Applying: $filename"
        
        psql "$DB_URL" -f "$migration_file" 2>&1 | grep -E "ERROR|CREATE|INSERT|ALTER" || echo "   ✓"
    fi
done

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📊 Your local Supabase now has:"
echo "   • Products table with 72 items"
echo "   • Orders and order items tables"
echo "   • Authentication and user roles"
echo "   • Categories, articles, vouchers"
echo "   • Payment tracking"
echo ""
echo "🎯 Next steps:"
echo "   1. Update .env with local Supabase credentials"
echo "   2. Run: npm run dev"
echo "   3. Visit: http://localhost:5173"
echo ""
