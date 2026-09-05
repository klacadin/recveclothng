import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import sharp from "sharp";
import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

config({ path: ".env.local" });
config({ path: ".env" });

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const eventsDir = join(root, "public/events");
const mainPoster = join(eventsDir, "test-trail-run-poster.webp");
const twelveKmSource = join(
  root,
  "assets/c__Users_KHL_AppData_Roaming_Cursor_User_workspaceStorage_7057071d77fcb74cbe86d332f916812e_images_image-c45cd616-689b-4725-b17d-f5cdafde20f8.png"
);
const twelveKmFallback = join(
  "C:/Users/KHL/.cursor/projects/z-DEV-01-CORE-STARTUPS-MSMEs-recveclothng/assets/c__Users_KHL_AppData_Roaming_Cursor_User_workspaceStorage_7057071d77fcb74cbe86d332f916812e_images_image-c45cd616-689b-4725-b17d-f5cdafde20f8.png"
);

const url =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!url) {
  console.error("No DATABASE_URL configured");
  process.exit(1);
}

mkdirSync(eventsDir, { recursive: true });

async function writeLabeledPoster(filename, label, price) {
  const width = 1024;
  const barH = 180;
  const svg = Buffer.from(`
    <svg width="${width}" height="${barH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#111111"/>
      <text x="50%" y="48%" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" fill="#ffffff">${label}</text>
      <text x="50%" y="78%" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#d4d4d4">${price}</text>
    </svg>
  `);
  const out = join(eventsDir, filename);
  await sharp(mainPoster)
    .composite([{ input: svg, gravity: "south" }])
    .webp({ quality: 80 })
    .toFile(out);
  return `/events/${filename}`;
}

async function writeReferencePoster(filename, sourcePath) {
  const out = join(eventsDir, filename);
  await sharp(sourcePath)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  return `/events/${filename}`;
}

function existingPoster(filename) {
  return existsSync(join(eventsDir, filename)) ? `/events/${filename}` : null;
}

const twelveSource = existsSync(twelveKmSource) ? twelveKmSource : twelveKmFallback;
const poster12 =
  existingPoster("test-trail-run-12km.webp") ||
  (existsSync(twelveSource)
    ? await writeReferencePoster("test-trail-run-12km.webp", twelveSource)
    : await writeLabeledPoster("test-trail-run-12km.webp", "12KM", "₱2,000"));

const ticketTiers = [
  {
    slug: "7km",
    name: "7km",
    price: 1000,
    image_url: existingPoster("test-trail-run-7km.webp") || (await writeLabeledPoster("test-trail-run-7km.webp", "7KM", "₱1,000")),
    bib_prefix: "07",
    has_singlet: false,
    has_finisher_shirt: true,
    has_crop_top: true,
  },
  {
    slug: "12km",
    name: "12km",
    price: 2000,
    image_url: poster12,
    bib_prefix: "12",
    has_singlet: true,
    has_finisher_shirt: true,
    has_crop_top: true,
  },
  {
    slug: "25km",
    name: "25km",
    price: 3000,
    image_url: existingPoster("test-trail-run-25km.webp") || (await writeLabeledPoster("test-trail-run-25km.webp", "25KM", "₱3,000")),
    bib_prefix: "25",
    has_singlet: true,
    has_finisher_shirt: true,
    has_crop_top: true,
  },
];

const event = {
  slug: "year-end-pasasalamat-trail-run",
  title: "NOBODY X LAAW Year End Pasasalamat Trail Run",
  description:
    "Choose 7km (₱1,000), 12km (₱2,000), or 25km (₱3,000). 7km includes a finisher t-shirt (no event singlet). 12km and 25km include event singlet and finisher t-shirt. Croptop is optional. After payment you get a racebib: 07-001, 12-001, or 25-001.",
  location: "Maramag, Bukidnon",
  startsAt: "2026-09-19T05:00:00+08:00",
  endsAt: "2026-09-19T12:00:00+08:00",
  price: "1000",
  paymentInstructions:
    "Complete HitPay after registering. Racebib numbers are assigned when paid: 7km starts at 07-001, 12km at 12-001, 25km at 25-001. Unpaid runners cannot check in.",
  imageUrl: "/events/test-trail-run-poster.webp",
};

const sql = neon(url);
const allEvents = await sql`
  SELECT id, slug, ticket_tiers
  FROM events
`;
const has7km = (tiers) => Array.isArray(tiers) && tiers.some((tier) => String(tier.slug || tier.name || "").includes("7km"));
const liveEvent = allEvents.find((row) => has7km(row.ticket_tiers)) || allEvents.find((row) => row.slug === "test-trail-run");
const occupyingSlug = allEvents.find((row) => row.slug === event.slug && row.id !== liveEvent?.id);

if (occupyingSlug) {
  await sql.query(
    `UPDATE events
     SET slug = $1, is_active = false, updated_at = now()
     WHERE id = $2`,
    [`${event.slug}-archive`, occupyingSlug.id]
  );
}

const values = [
  event.slug,
  event.title,
  event.description,
  event.location,
  event.startsAt,
  event.endsAt,
  event.price,
  event.paymentInstructions,
  event.imageUrl,
  JSON.stringify(ticketTiers),
];

if (liveEvent) {
  await sql.query(
    `UPDATE events SET
      slug = $1,
      title = $2,
      description = $3,
      location = $4,
      starts_at = $5::timestamptz,
      ends_at = $6::timestamptz,
      price = $7,
      payment_instructions = $8,
      image_url = $9,
      ticket_tiers = $10::jsonb,
      is_active = true,
      updated_at = now()
    WHERE id = $11`,
    [...values, liveEvent.id]
  );
} else {
  await sql.query(
    `INSERT INTO events (
      slug, title, description, location, starts_at, ends_at, price,
      payment_instructions, image_url, ticket_tiers, is_active
    ) VALUES ($1, $2, $3, $4, $5::timestamptz, $6::timestamptz, $7, $8, $9, $10::jsonb, true)`,
    values
  );
}

const rows = await sql`
  SELECT slug, title, image_url, ticket_tiers, is_active
  FROM events
  WHERE slug = 'year-end-pasasalamat-trail-run'
`;
console.log(JSON.stringify(rows[0], null, 2));
