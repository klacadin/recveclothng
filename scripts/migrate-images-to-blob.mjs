/**
 * Rewrite product image URLs from Supabase storage → Vercel Blob.
 *
 * 1. Download each unique supabase image URL
 * 2. Upload to Blob
 * 3. UPDATE products.image_url / images in Postgres
 *
 * Usage:
 *   DATABASE_URL=... BLOB_READ_WRITE_TOKEN=... node scripts/migrate-images-to-blob.mjs
 */
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!databaseUrl || !token) {
  console.error("Missing DATABASE_URL or BLOB_READ_WRITE_TOKEN");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function rehost(url) {
  if (!url || !url.includes("supabase.co")) return url;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const name = url.split("/").pop() || `img-${Date.now()}.jpg`;
  const blob = await put(`product-images/migrated/${name}`, buf, {
    access: "public",
    token,
  });
  return blob.url;
}

async function main() {
  const rows = await sql`SELECT id, image_url, images FROM products`;
  console.log(`Products: ${rows.length}`);
  for (const row of rows) {
    let imageUrl = row.image_url;
    let images = row.images;
    try {
      if (imageUrl?.includes("supabase.co")) {
        imageUrl = await rehost(imageUrl);
      }
      if (Array.isArray(images)) {
        images = await Promise.all(images.map((u) => (u?.includes("supabase.co") ? rehost(u) : u)));
      }
      await sql`
        UPDATE products SET image_url = ${imageUrl}, images = ${images} WHERE id = ${row.id}
      `;
      console.log("Updated", row.id);
    } catch (e) {
      console.error("Failed", row.id, e.message);
    }
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
