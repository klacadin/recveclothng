import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Remote (production) Supabase
const remoteUrl = process.env.REMOTE_SUPABASE_URL;
const remoteKey = process.env.REMOTE_SERVICE_ROLE_KEY;

// Local Supabase
const localUrl = process.env.LOCAL_SUPABASE_URL || 'http://localhost:54321';
const localKey = process.env.LOCAL_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5SmhiR2NpT2lKSVV6STFOaUo5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYxNDU1MTU4MCwiZXhwIjoxNjQ2MDg3NTgwfQ.rYPNzFc0v-9pnHQ8eYEWeLfXP3SkAjP7DkxwZKiDt8Y';

if (!remoteUrl || !remoteKey) {
  console.error('❌ Missing REMOTE_SUPABASE_URL or REMOTE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const remote = createClient(remoteUrl, remoteKey);
const local = createClient(localUrl, localKey);

const tables = [
  'products',
  'product_variants',
  'orders',
  'order_items',
  'customers',
  'articles',
  'users',
  'profiles',
];

async function migrateDatabase() {
  console.log('🚀 Starting database migration...\n');
  console.log(`📍 Remote: ${remoteUrl}`);
  console.log(`📍 Local: ${localUrl}\n`);

  for (const table of tables) {
    try {
      console.log(`📦 Migrating table: ${table}...`);

      // Fetch all data from remote
      const { data, error: fetchError } = await remote
        .from(table)
        .select('*')
        .limit(10000);

      if (fetchError) {
        if (fetchError.message.includes('does not exist')) {
          console.log(`   ⏭️  Table does not exist (skipping)\n`);
          continue;
        }
        throw fetchError;
      }

      if (!data || data.length === 0) {
        console.log(`   ✓ No data to migrate\n`);
        continue;
      }

      // Insert into local
      const { error: insertError } = await local
        .from(table)
        .insert(data);

      if (insertError) {
        throw insertError;
      }

      console.log(`   ✓ Migrated ${data.length} records\n`);
    } catch (error) {
      console.error(`   ❌ Error migrating ${table}:`, error.message);
    }
  }

  console.log('✅ Migration complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Update your .env file:');
  console.log('   VITE_SUPABASE_URL=http://localhost:54321');
  console.log('   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5SmhiR2NpT2lKSVV6STFOaUo5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTQ1NTE1ODAsImV4cCI6MTY0NjA4NzU4MH0.yO_iS1QqJ1w5x3VYsNnUUNmXNHW5k1C0t5rKPXHEaUs');
  console.log('2. Restart your dev server (npm run dev)');
  console.log('3. Test the app locally\n');
}

migrateDatabase().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
