#!/bin/bash

# Run development server in Docker connected to local Supabase

SUPABASE_URL="http://host.docker.internal:54321"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cGFiYXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ1NjkzNDgsImV4cCI6OTk5OTk5OTk5OX0.cNwi7sJJrfqXZzqKXJ6SfHgL6XNlmOKXNuNnv9Mg3k8"

echo "🚀 Starting Vite app in Docker..."
echo "📍 Supabase URL: $SUPABASE_URL"
echo ""

docker run -it --rm \
  -p 5173:3000 \
  -e VITE_SUPABASE_URL="$SUPABASE_URL" \
  -e VITE_SUPABASE_PUBLISHABLE_KEY="$SUPABASE_KEY" \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  -v $(pwd)/package.json:/app/package.json:ro \
  --name vite-dev \
  vite-app:dev \
  npm run dev -- --host
