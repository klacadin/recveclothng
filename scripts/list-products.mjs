import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log('No products found.');
      return;
    }

    console.log(`\n📦 Total Products: ${data.length}\n`);
    console.log('─'.repeat(120));
    console.log(
      'ID'.padEnd(37) +
      'SKU'.padEnd(12) +
      'Name'.padEnd(30) +
      'Price'.padEnd(10) +
      'Stock'.padEnd(8) +
      'Active'.padEnd(8) +
      'Created'
    );
    console.log('─'.repeat(120));

    data.forEach((product) => {
      const isActive = product.is_active ? '✓' : '✗';
      const created = new Date(product.created_at).toLocaleDateString();
      
      console.log(
        String(product.id).substring(0, 36).padEnd(37) +
        (product.sku || '—').padEnd(12) +
        (product.name || '—').substring(0, 29).padEnd(30) +
        `$${product.price || 0}`.padEnd(10) +
        (product.stock_quantity || 0).toString().padEnd(8) +
        isActive.padEnd(8) +
        created
      );
    });

    console.log('─'.repeat(120));

    // Summary stats
    const activeCount = data.filter((p) => p.is_active).length;
    const inactiveCount = data.length - activeCount;
    const totalValue = data.reduce((sum, p) => sum + (p.price || 0) * (p.stock_quantity || 0), 0);

    console.log(`\n📊 Summary:`);
    console.log(`  Active Products: ${activeCount}`);
    console.log(`  Inactive Products: ${inactiveCount}`);
    console.log(`  Total Inventory Value: $${totalValue.toFixed(2)}`);
    console.log('');
  } catch (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }
}

listProducts();
