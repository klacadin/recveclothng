import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '[REDACTED]';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importProducts(csvFilePath) {
  try {
    console.log('📦 Importing products from CSV...\n');

    // Read CSV file
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`📄 Found ${records.length} products in CSV\n`);

    // Transform and clean data
    const products = records.map((row) => ({
      id: row.id,
      sku: row.sku?.trim() || null,
      name: row.name?.trim() || null,
      price: parseFloat(row.price) || 0,
      stock_quantity: parseInt(row.stock_quantity) || 0,
      is_active: row.is_active === 'true',
      created_at: row.created_at || new Date().toISOString(),
    }));

    // Insert in batches (Supabase has limits)
    const batchSize = 100;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;

      try {
        const { error } = await supabase
          .from('products')
          .insert(batch);

        if (error) {
          console.error(`❌ Batch ${batchNum} failed:`, error.message);
          errorCount += batch.length;
        } else {
          console.log(`✓ Batch ${batchNum}: ${batch.length} products inserted`);
          successCount += batch.length;
        }
      } catch (err) {
        console.error(`❌ Batch ${batchNum} error:`, err.message);
        errorCount += batch.length;
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   ✓ Successfully imported: ${successCount} products`);
    if (errorCount > 0) {
      console.log(`   ✗ Failed: ${errorCount} products`);
    }
    console.log(`\n📍 Products are now available in your local Supabase!\n`);
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Get CSV file path from arguments or use default
const csvPath = process.argv[2] || './products.csv';

if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV file not found: ${csvPath}`);
  process.exit(1);
}

importProducts(csvPath);
