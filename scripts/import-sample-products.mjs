import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321';
const supabaseKey = '[REDACTED]';

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  { id: 'c73394bd-d4e3-4c74-bc5a-079ae81283ed', sku: 'BLPNK', name: 'BLUE PINK', price: 350.00, stock_quantity: 34, is_active: true, created_at: '2026-05-19 05:58:50.805369+00' },
  { id: '6a389c1a-39a3-4fc8-a403-0d4549ca246a', sku: 'PNKDMD', name: 'PINK DIAMOND', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 04:18:13.359509+00' },
  { id: '70b19a83-42a0-4476-b859-915401ac2007', sku: 'PNKHRT', name: 'PINK HEART', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 04:16:03.515339+00' },
  { id: '04aceae0-bb32-4ffd-803c-1d315fad9e8e', sku: 'PNKBRSH', name: 'PINK BRUSH', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 04:14:08.187435+00' },
  { id: 'd02958ba-f6fa-4905-96f4-7d76e0c27a66', sku: 'RNBW', name: 'RAINBOW PINK', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 04:13:16.531119+00' },
  { id: '43f85407-3f21-4a2e-9ff3-5f79bc19ed9e', sku: 'PHNTR', name: 'PINK PANTHER', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 04:11:52.975832+00' },
  { id: 'a984dbd9-5599-4795-b60d-b4cd99645b76', sku: 'NTRSD', name: 'NATURE SEED', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 04:03:55.577124+00' },
  { id: '7cdfc7d2-10b1-42dc-a2c4-d9c5c3311110', sku: 'GHST', name: 'GHOST', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 03:49:08.787974+00' },
  { id: '7b42f6b9-720a-4e67-837a-d1cf58cedd16', sku: 'PNKGRN', name: 'PINK GREEN', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 03:44:47.964725+00' },
  { id: '19c0e0a6-f691-4b13-856c-4656caacb7ce', sku: 'OLDNW', name: 'OLDNEWS', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 03:43:01.918977+00' },
  { id: 'cdb78ab3-e198-4096-96b8-425310f02346', sku: 'SNBRTS', name: 'SUNBURST', price: 350.00, stock_quantity: 34, is_active: true, created_at: '2026-05-19 03:32:24.278041+00' },
  { id: 'f5ad8dcd-f709-4a69-b1f2-50f42644c4b0', sku: 'PRPL-STRP', name: 'PURPLE STRIPE', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 03:31:44.06375+00' },
  { id: '2c94f815-739c-4ded-89cd-4a9a1f78576f', sku: 'PNK-STRP', name: 'PINK STRIPE', price: 350.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 03:30:43.583428+00' },
  { id: '53225db4-d681-4ea2-9e22-80c074731fb7', sku: 'BLCK DGN SINGLET', name: 'BLACK DRAGON', price: 350.00, stock_quantity: 34, is_active: true, created_at: '2026-05-19 02:56:25.679097+00' },
  { id: 'c5a363e2-3599-4a2c-97d0-db725d6d68dc', sku: 'ALV', name: 'ALIVE', price: 400.00, stock_quantity: 35, is_active: true, created_at: '2026-05-19 02:47:07.516844+00' },
  { id: '84140088-b1f7-449b-80a4-d718a6ce992e', sku: 'CEY BLSS', name: 'CHERRY BLOSSOMS', price: 400.00, stock_quantity: 33, is_active: true, created_at: '2026-05-19 02:36:37.125742+00' },
];

async function importProducts() {
  try {
    console.log('🔌 Connecting to local Supabase...');
    console.log(`📍 URL: ${supabaseUrl}\n`);

    console.log(`📦 Importing ${products.length} sample products...\n`);

    const { error } = await supabase
      .from('products')
      .insert(products);

    if (error) {
      console.error('❌ Import failed:', error.message);
      console.error('Details:', error);
      process.exit(1);
    }

    console.log('✅ Products imported successfully!');
    console.log(`\n📊 Imported ${products.length} products`);
    console.log('\n🎉 Your local Supabase is now ready!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

importProducts();
