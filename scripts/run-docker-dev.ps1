#!/bin/bash

echo "🚀 Starting your app in Docker..."
echo ""

# Use the Vite image we built earlier
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhreSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE0NzkyNDAwLCJleHAiOjE5MzA0NjA0MDB9.CRXP3ySUZREw7tHToZiHQdQA3aszrF9SvMt8sqrnqWE"

docker run -it --rm \
  -p 5173:3000 \
  --name vite-app-dev \
  -e VITE_SUPABASE_URL=http://host.docker.internal:54321 \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=$ANON_KEY \
  -v $(pwd)/src:/app/src \
  node:20-alpine \
  sh -c "cd /app && npm install && npm run dev -- --host 0.0.0.0"

