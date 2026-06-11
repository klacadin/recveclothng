import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321';
const supabaseKey = '[REDACTED]';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔌 Testing local Supabase connection...\n');
    console.log(`URL: ${supabaseUrl}`);

    // Try to fetch products
    const { data, error } = await supabase
      .from('products')
      .select('COUNT(*)', { count: 'exact' })
      .limit(1);

    if (error) {
      console.log('❌ Connection failed:', error.message);
      process.exit(1);
    }

    console.log('✅ Connection successful!');
    console.log('📊 Local Supabase is ready to use.\n');

    // Test with a simple query
    const { data: products, error: queryError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (!queryError && products && products.length > 0) {
      console.log('📦 Sample product found:');
      console.log(JSON.stringify(products[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
