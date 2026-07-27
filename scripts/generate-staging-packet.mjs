/**
 * CleverGrit-branded staging review PDF — single light landscape page.
 * Usage: node scripts/generate-staging-packet.mjs
 */
import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";

// Stable preview alias (public — no Vercel login required)
const STAGING_URL = "https://reveclothing-klacadin-khaltech.vercel.app";
const ALIAS_HINT = "https://reveclothing-p39kzchmy-khaltech.vercel.app";
const BRAND_SRC = resolve(
  "docs/assets/CleverGrit_REVE_Affiliate_Pricing_Landscape.png"
);
const FAN_EMBLEM = resolve("docs/assets/clevergrit-fan-emblem.png");
const FONT_DIR = resolve("docs/assets/fonts");
const FONT_FILES = {
  poppins: resolve(FONT_DIR, "Poppins-Regular.ttf"),
  poppinsSemi: resolve(FONT_DIR, "Poppins-SemiBold.ttf"),
  poppinsBold: resolve(FONT_DIR, "Poppins-Bold.ttf"),
  aptos: resolve(FONT_DIR, "AptosNarrow-Regular.ttf"),
  aptosBold: resolve(FONT_DIR, "AptosNarrow-Bold.ttf"),
};
const OUT_DIR = resolve("docs");
const OUT_FILE = resolve(OUT_DIR, "REVE-Staging-Review-Packet.pdf");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

for (const [key, file] of Object.entries(FONT_FILES)) {
  if (!existsSync(file)) {
    throw new Error(`Missing font (${key}): ${file}`);
  }
}

/** Crop CleverGrit fan mark from brand art; flatten red wedge to yellow. */
async function ensureFanEmblem() {
  if (!existsSync(BRAND_SRC)) return;
  const { data, info } = await sharp(BRAND_SRC)
    .extract({ left: 6, top: 46, width: 120, height: 64 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (y > 48 && r > 180 && g < 100 && b < 100) {
        data[i] = 245;
        data[i + 1] = 196;
        data[i + 2] = 0;
      }
    }
  }
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(FAN_EMBLEM);
}

await ensureFanEmblem();

// Light CleverGrit palette
const BG = "#FAFAF8";
const CARD = "#FFFFFF";
const CARD_BORDER = "#E8E4DC";
const YELLOW = "#F5C400";
const RED = "#E10600";
const INK = "#1A1A1A";
const MUTED = "#6B6B6B";
const LINE = "#E0DCD4";

const PAGE_W = 792;
const PAGE_H = 612;
const M = 28;

const doc = new PDFDocument({
  size: [PAGE_W, PAGE_H],
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  autoFirstPage: true,
  bufferPages: true,
  info: {
    Title: "REVE Clothing × CleverGrit — Staging Review (1-Pager)",
    Author: "CleverGrit Web Services",
    Subject: "Single-page staging walkthrough for REVE Clothing x NOBODY",
  },
});

const stream = createWriteStream(OUT_FILE);
doc.pipe(stream);

// Only Poppins + Aptos Narrow (no Helvetica / Courier)
doc.registerFont("Poppins", FONT_FILES.poppins);
doc.registerFont("Poppins-SemiBold", FONT_FILES.poppinsSemi);
doc.registerFont("Poppins-Bold", FONT_FILES.poppinsBold);
doc.registerFont("AptosNarrow", FONT_FILES.aptos);
doc.registerFont("AptosNarrow-Bold", FONT_FILES.aptosBold);

const F = {
  display: "Poppins-Bold",
  displaySemi: "Poppins-SemiBold",
  body: "AptosNarrow",
  bodyBold: "AptosNarrow-Bold",
};

function t(str, x, y, opts = {}) {
  const { link, underline, width, align, ...rest } = opts;
  if (link) {
    const w = width ?? Math.min(doc.widthOfString(str) + 2, PAGE_W - x - M);
    doc.text(str, x, y, {
      width: w,
      height: 12,
      link,
      underline: underline ?? true,
      ...rest,
    });
    return;
  }
  doc.text(str, x, y, { lineBreak: false, width, align, ...rest });
}

/** CleverGrit fan emblem — scalloped semi-circle with ribs + red tips. */
function drawFanEmblem(cx, cy, scale = 1, opacity = 1) {
  const s = scale;
  const lobes = 6;

  function scallopPath(r, bump = 1.14) {
    doc.moveTo(cx, cy);
    for (let i = 0; i <= lobes; i++) {
      const a0 = Math.PI + (i / lobes) * Math.PI;
      const a1 = Math.PI + ((i + 0.5) / lobes) * Math.PI;
      const a2 = Math.PI + ((i + 1) / lobes) * Math.PI;
      if (i === 0) doc.moveTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r);
      doc.quadraticCurveTo(
        cx + Math.cos(a1) * r * bump,
        cy + Math.sin(a1) * r * bump,
        cx + Math.cos(a2) * r,
        cy + Math.sin(a2) * r
      );
    }
    doc.lineTo(cx, cy);
  }

  doc.save();
  doc.fillOpacity(opacity).strokeOpacity(opacity);

  // Soft yellow mound under the fan (brand base)
  doc
    .moveTo(cx - 36 * s, cy + 2 * s)
    .quadraticCurveTo(cx, cy + 10 * s, cx + 36 * s, cy + 2 * s)
    .quadraticCurveTo(cx, cy - 2 * s, cx - 36 * s, cy + 2 * s)
    .fillColor(YELLOW)
    .fill();

  const layers = [
    { r: 36 * s, color: RED, bump: 1.12 },
    { r: 29 * s, color: YELLOW, bump: 1.13 },
    { r: 21 * s, color: RED, bump: 1.12 },
    { r: 14 * s, color: INK, bump: 1.1 },
  ];
  for (const layer of layers) {
    scallopPath(layer.r, layer.bump);
    doc.fillColor(layer.color).fill();
  }

  // White core at pivot
  doc
    .moveTo(cx - 5.5 * s, cy)
    .quadraticCurveTo(cx, cy - 8 * s, cx + 5.5 * s, cy)
    .fillColor("#FFFFFF")
    .fill();

  // Ribs + red tip dots
  const ribs = 5;
  for (let i = 0; i < ribs; i++) {
    const a = Math.PI + ((i + 0.5) / ribs) * Math.PI;
    const x0 = cx + Math.cos(a) * 5 * s;
    const y0 = cy + Math.sin(a) * 5 * s;
    const x1 = cx + Math.cos(a) * 40 * s;
    const y1 = cy + Math.sin(a) * 40 * s;
    doc
      .strokeColor(INK)
      .lineWidth(Math.max(0.6, 0.75 * s))
      .moveTo(x0, y0)
      .lineTo(x1, y1)
      .stroke();
    doc.circle(x1, y1, 2 * s).fillColor(RED).fill();
  }

  doc.restore();
  doc.fillOpacity(1).strokeOpacity(1);
}

// Page background
doc.rect(0, 0, PAGE_W, PAGE_H).fill(BG);
// Soft corner accents (light, not heavy blocks)
doc.save();
doc
  .moveTo(0, 0)
  .lineTo(120, 0)
  .lineTo(0, 70)
  .fillColor(YELLOW)
  .fillOpacity(0.35)
  .fill();
doc
  .moveTo(PAGE_W, 0)
  .lineTo(PAGE_W - 90, 0)
  .lineTo(PAGE_W, 55)
  .fillColor(RED)
  .fillOpacity(0.2)
  .fill();
doc.restore();
doc.fillOpacity(1);

// Top accent bars
doc.rect(0, 0, PAGE_W, 4).fill(YELLOW);
doc.rect(0, 4, PAGE_W, 2).fill(RED);

// Header: authentic fan emblem + wordmark
if (existsSync(FAN_EMBLEM)) {
  doc.image(FAN_EMBLEM, M, 12, { width: 78, height: 48, fit: [78, 48] });
} else {
  drawFanEmblem(M + 38, 58, 1.05, 1);
}

const textX = M + 92;
doc.fillColor(INK).font(F.display).fontSize(13);
t("CLEVERGRIT", textX, 18);
doc.fillColor(RED).font(F.displaySemi).fontSize(8);
t("WEB SERVICES", textX, 34);
doc.fillColor(MUTED).font(F.body).fontSize(7.5);
t("Built Smart. Driven by Grit.", textX, 48);

doc.fillColor(INK).font(F.display).fontSize(14);
t("STAGING REVIEW PACKET", M + 280, 20);
doc.fillColor(MUTED).font(F.body).fontSize(9);
t("REVE Clothing  ×  NOBODY", M + 280, 40);

doc.fillColor(RED).font(F.bodyBold).fontSize(8);
t("1-PAGER · CONFIDENTIAL", PAGE_W - M - 150, 20, {
  width: 150,
  align: "right",
});
doc.fillColor(MUTED).font(F.body).fontSize(7.5);
t(
  new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  PAGE_W - M - 150,
  36,
  { width: 150, align: "right" }
);

doc
  .strokeColor(LINE)
  .lineWidth(1)
  .moveTo(M, 76)
  .lineTo(PAGE_W - M, 76)
  .stroke();

function sectionLabel(x, y, label) {
  doc.rect(x, y, 3, 11).fill(RED);
  doc.fillColor(INK).font(F.displaySemi).fontSize(9);
  t(label, x + 10, y);
}

function card(x, y, w, h) {
  doc.roundedRect(x, y, w, h, 5).fill(CARD);
  doc
    .roundedRect(x, y, w, h, 5)
    .lineWidth(1)
    .strokeColor(CARD_BORDER)
    .stroke();
}

// ── Left column ──
const leftX = M;
const leftW = 360;
let y = 88;

sectionLabel(leftX, y, "STAGING URL");
y += 16;
card(leftX, y, leftW, 52);
doc.fillColor(RED).font(F.bodyBold).fontSize(9);
t(STAGING_URL, leftX + 10, y + 10, { link: STAGING_URL, width: leftW - 20 });
doc.fillColor(MUTED).font(F.body).fontSize(7.5);
t(`Alias: ${ALIAS_HINT}`, leftX + 10, y + 28, {
  link: ALIAS_HINT,
  width: leftW - 20,
});

y += 62;
sectionLabel(leftX, y, "TEST ADMINS (STAGING ONLY)");
y += 16;

const half = (leftW - 8) / 2;
card(leftX, y, half, 78);
doc.fillColor(RED).font(F.bodyBold).fontSize(8);
t("ADMIN A", leftX + 8, y + 8);
doc.fillColor(INK).font(F.body).fontSize(7.5);
t("khlacadin@gmail.com", leftX + 8, y + 24);
doc.fillColor(RED).font(F.bodyBold).fontSize(7.5);
t("ReveAdmin!774ade8f", leftX + 8, y + 38);
doc.fillColor(MUTED).font(F.body).fontSize(7);
t("→ /admin after login", leftX + 8, y + 56);

card(leftX + half + 8, y, half, 78);
doc.fillColor(RED).font(F.bodyBold).fontSize(8);
t("ADMIN B (CLIENT)", leftX + half + 16, y + 8);
doc.fillColor(INK).font(F.body).fontSize(7.5);
t("reveclothing214@gmail.com", leftX + half + 16, y + 24);
doc.fillColor(RED).font(F.bodyBold).fontSize(7.5);
t("ReveAdmin!fca12e5e", leftX + half + 16, y + 38);
doc.fillColor(MUTED).font(F.body).fontSize(7);
t("Change password after first login", leftX + half + 16, y + 56);

y += 90;
sectionLabel(leftX, y, "QUICK LINKS");
y += 16;

const links = [
  ["Shop", `${STAGING_URL}/shop`],
  ["Affiliate register", `${STAGING_URL}/affiliate?action=register`],
  ["Affiliate login", `${STAGING_URL}/affiliate`],
  ["Admin", `${STAGING_URL}/admin`],
];
card(leftX, y, leftW, 78);
let ly = y + 8;
for (const [label, url] of links) {
  doc.fillColor(INK).font(F.bodyBold).fontSize(7.5);
  const labelStr = `${label}: `;
  t(labelStr, leftX + 10, ly);
  const labelW = doc.widthOfString(labelStr);
  doc.fillColor(RED).font(F.body).fontSize(7.5);
  t(url, leftX + 10 + labelW, ly, { link: url, width: leftW - 20 - labelW });
  ly += 16;
}

// ── Right column ──
const rightX = M + leftW + 20;
const rightW = PAGE_W - rightX - M;
y = 88;

sectionLabel(rightX, y, "WALKTHROUGH");
y += 16;

const walks = [
  {
    title: "1. SHOPPER",
    lines: "Open URL → Shop → product → cart. Confirm images & prices.",
    accent: YELLOW,
  },
  {
    title: "2. AFFILIATE",
    lines:
      "Register → 8-char code → Admin Approves → /?ref=CODE → /affiliate.",
    accent: RED,
  },
  {
    title: "3. ADMIN",
    lines:
      "Login → /admin → Orders / Products / Affiliates. Aff CODE on orders.",
    accent: YELLOW,
  },
];

for (const wItem of walks) {
  card(rightX, y, rightW, 48);
  doc.rect(rightX, y, 3, 48).fill(wItem.accent);
  doc.fillColor(INK).font(F.displaySemi).fontSize(8);
  t(wItem.title, rightX + 12, y + 8);
  doc.fillColor(MUTED).font(F.body).fontSize(7.5);
  doc.text(wItem.lines, rightX + 12, y + 22, {
    width: rightW - 22,
    height: 20,
  });
  y += 54;
}

y += 4;
sectionLabel(rightX, y, "NOTES & CHECKLIST");
y += 16;

const notesH = 150;
card(rightX, y, rightW, notesH);
doc.fillColor(MUTED).font(F.body).fontSize(7.5);
doc.text(
  "Staging ≠ production. Live site stays on prior deploy until cutover. Stack: Next.js · Neon · Clerk · Blob. HitPay webhook cutover pending go-live.",
  rightX + 10,
  y + 8,
  { width: rightW - 20, height: 36, lineGap: 1 }
);

const checks = [
  "Products & images load; detail pages open",
  "Affiliate CTA clear; 8-char code works",
  "Admin can approve affiliates",
  "Ready for production promote? Y / N",
];
let cy = y + 50;
for (const c of checks) {
  doc.rect(rightX + 12, cy + 1, 8, 8).lineWidth(1).strokeColor(RED).stroke();
  doc.fillColor(INK).font(F.body).fontSize(7.5);
  t(c, rightX + 26, cy);
  cy += 18;
}

doc.fillColor(MUTED).font(F.body).fontSize(7);
doc.text(
  "Staging is public — no Vercel account needed. Open the URL above in any browser.",
  rightX + 10,
  y + notesH - 22,
  { width: rightW - 20, height: 16 }
);

// Soft fan watermark (bottom-right)
drawFanEmblem(PAGE_W - 52, PAGE_H - 58, 1.35, 0.07);

// Footer
doc
  .strokeColor(LINE)
  .lineWidth(1)
  .moveTo(M, PAGE_H - 26)
  .lineTo(PAGE_W - M, PAGE_H - 26)
  .stroke();
doc.fillColor(MUTED).font(F.body).fontSize(7);
t(
  "CLEVERGRIT WEB SERVICES  ·  QUEZON, BUKIDNON  ·  clevergritph@gmail.com",
  M,
  PAGE_H - 18
);
doc.fillColor(RED).font(F.displaySemi).fontSize(7);
t("BUILT SMART. DRIVEN BY GRIT.", PAGE_W - M - 160, PAGE_H - 18, {
  width: 160,
  align: "right",
});

const range = doc.bufferedPageRange();
if (range.count > 1) {
  throw new Error(
    `PDF spilled to ${range.count} pages; adjust layout so content fits on 1 page.`
  );
}

doc.end();

await new Promise((resolveDone, reject) => {
  stream.on("finish", resolveDone);
  stream.on("error", reject);
});

console.log(
  JSON.stringify({
    ok: true,
    file: OUT_FILE,
    pages: range.count,
    theme: "light",
    fonts: ["Poppins", "Aptos Narrow"],
    emblem: existsSync(FAN_EMBLEM) ? "fan-badge" : "fan-vector",
  })
);
