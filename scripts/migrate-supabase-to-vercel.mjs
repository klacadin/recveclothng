/**
 * Migrate commerce data from Supabase → Vercel Postgres.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... DATABASE_URL=... node scripts/migrate-supabase-to-vercel.mjs
 *
 * Requires: schema already applied (drizzle/0000_init.sql)
 */
import { createClient } from "@supabase/supabase-js";
import { neon } from "@neondatabase/serverless";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!supabaseUrl || !serviceKey || !databaseUrl) {
  console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or DATABASE_URL");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);
const sql = neon(databaseUrl);

async function copyTable(name, mapRow) {
  const { data, error } = await supabase.from(name).select("*");
  if (error) throw new Error(`${name}: ${error.message}`);
  console.log(`${name}: ${data?.length ?? 0} rows`);
  for (const row of data || []) {
    await mapRow(row);
  }
}

async function main() {
  await copyTable("categories", async (r) => {
    await sql`
      INSERT INTO categories (id, name, slug, description, code, image_url, sort_order, is_active, created_at, updated_at)
      VALUES (${r.id}, ${r.name}, ${r.slug}, ${r.description}, ${r.code}, ${r.image_url}, ${r.sort_order ?? 0}, ${r.is_active ?? true}, ${r.created_at}, ${r.updated_at})
      ON CONFLICT (id) DO NOTHING
    `;
  });

  await copyTable("products", async (r) => {
    await sql`
      INSERT INTO products (
        id, name, description, price, sku, category, image_url, images,
        stock_quantity, low_stock_threshold, weight_grams, is_active,
        created_by_email, updated_by_email, created_at, updated_at
      ) VALUES (
        ${r.id}, ${r.name}, ${r.description}, ${r.price}, ${r.sku}, ${r.category},
        ${r.image_url}, ${r.images}, ${r.stock_quantity ?? 0}, ${r.low_stock_threshold ?? 5},
        ${r.weight_grams}, ${r.is_active ?? true}, ${r.created_by_email}, ${r.updated_by_email},
        ${r.created_at}, ${r.updated_at}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  });

  await copyTable("product_variants", async (r) => {
    await sql`
      INSERT INTO product_variants (
        id, product_id, size, stock_quantity, low_stock_threshold, sku_suffix, created_at, updated_at
      ) VALUES (
        ${r.id}, ${r.product_id}, ${r.size}, ${r.stock_quantity ?? 0},
        ${r.low_stock_threshold ?? 5}, ${r.sku_suffix}, ${r.created_at}, ${r.updated_at}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  });

  await copyTable("orders", async (r) => {
    await sql`
      INSERT INTO orders (
        id, order_number, customer_name, customer_email, customer_phone, shipping_address,
        status, payment_method, subtotal, shipping_fee, total, notes,
        proof_of_payment_url, proof_uploaded_at, payment_reference_number,
        hitpay_payment_id, waybill_number, user_id, created_at, updated_at
      ) VALUES (
        ${r.id}, ${r.order_number}, ${r.customer_name}, ${r.customer_email}, ${r.customer_phone},
        ${r.shipping_address}, ${r.status}, ${r.payment_method}, ${r.subtotal}, ${r.shipping_fee},
        ${r.total}, ${r.notes}, ${r.proof_of_payment_url}, ${r.proof_uploaded_at},
        ${r.payment_reference_number}, ${r.xendit_payment_id || r.hitpay_payment_id},
        ${r.waybill_number}, ${r.user_id}, ${r.created_at}, ${r.updated_at}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  });

  await copyTable("order_items", async (r) => {
    await sql`
      INSERT INTO order_items (
        id, order_id, product_id, product_name, product_sku, quantity, size, unit_price, total_price, created_at
      ) VALUES (
        ${r.id}, ${r.order_id}, ${r.product_id}, ${r.product_name}, ${r.product_sku},
        ${r.quantity}, ${r.size}, ${r.unit_price}, ${r.total_price}, ${r.created_at}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  });

  await copyTable("vouchers", async (r) => {
    await sql`
      INSERT INTO vouchers (
        id, code, discount_type, discount_value, is_active, max_uses, used_count, expires_at, created_at
      ) VALUES (
        ${r.id}, ${r.code}, ${r.discount_type || "percent"}, ${r.discount_value},
        ${r.is_active ?? true}, ${r.max_uses}, ${r.times_used ?? r.used_count ?? 0},
        ${r.expires_at}, ${r.created_at}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  });

  await copyTable("articles", async (r) => {
    await sql`
      INSERT INTO articles (
        id, title, slug, content, excerpt, source, source_url, image_url, published_at, created_at, updated_at
      ) VALUES (
        ${r.id}, ${r.title}, ${r.slug}, ${r.content}, ${r.excerpt}, ${r.source || "manual"},
        ${r.source_url}, ${r.image_url}, ${r.published_at}, ${r.created_at}, ${r.updated_at}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  });

  console.log("Migration complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
