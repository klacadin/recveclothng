/**
 * CleverGrit-branded How-To-Use PDF — single light landscape page.
 * Usage: node scripts/generate-howto-packet.mjs
 */
import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";

const STAGING_URL = "https://reveclothing-klacadin-khaltech.vercel.app";
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
const OUT_FILE = resolve(OUT_DIR, "REVE-How-To-Use.pdf");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

for (const [key, file] of Object.entries(FONT_FILES)) {
  if (!existsSync(file)) throw new Error(`Missing font (${key}): ${file}`);
}

async function ensureFanEmblem() {
  if (existsSync(FAN_EMBLEM) || !existsSync(BRAND_SRC)) return;
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
      if (y > 48 && data[i] > 180 && data[i + 1] < 100 && data[i + 2] < 100) {
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
const M = 26;

const doc = new PDFDocument({
  size: [PAGE_W, PAGE_H],
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  autoFirstPage: true,
  bufferPages: true,
  info: {
    Title: "REVE Clothing × CleverGrit — How to Use (1-Pager)",
    Author: "CleverGrit Web Services",
    Subject: "How to use REVE Clothing staging: shop, affiliate, admin",
  },
});

const stream = createWriteStream(OUT_FILE);
doc.pipe(stream);

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
  doc
    .moveTo(cx - 36 * s, cy + 2 * s)
    .quadraticCurveTo(cx, cy + 10 * s, cx + 36 * s, cy + 2 * s)
    .quadraticCurveTo(cx, cy - 2 * s, cx - 36 * s, cy + 2 * s)
    .fillColor(YELLOW)
    .fill();
  for (const layer of [
    { r: 36 * s, color: RED, bump: 1.12 },
    { r: 29 * s, color: YELLOW, bump: 1.13 },
    { r: 21 * s, color: RED, bump: 1.12 },
    { r: 14 * s, color: INK, bump: 1.1 },
  ]) {
    scallopPath(layer.r, layer.bump);
    doc.fillColor(layer.color).fill();
  }
  doc
    .moveTo(cx - 5.5 * s, cy)
    .quadraticCurveTo(cx, cy - 8 * s, cx + 5.5 * s, cy)
    .fillColor("#FFFFFF")
    .fill();
  for (let i = 0; i < 5; i++) {
    const a = Math.PI + ((i + 0.5) / 5) * Math.PI;
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

/** Draw a blue/red underlined clickable path chip, e.g. "/admin" */
function linkChip(label, url, x, y, maxW) {
  doc.fillColor(RED).font(F.bodyBold).fontSize(7.5);
  t(label, x, y, { link: url, underline: true, width: maxW });
}

function stepCard(x, y, w, h, num, title, lines, accent, link) {
  card(x, y, w, h);
  doc.rect(x, y, 3, h).fill(accent);
  doc.circle(x + 18, y + 16, 9).fill(accent);
  doc.fillColor(accent === YELLOW ? INK : "#FFFFFF").font(F.display).fontSize(9);
  t(String(num), x + 14.5, y + 11);
  doc.fillColor(INK).font(F.displaySemi).fontSize(8.5);
  t(title, x + 32, y + 10);

  const bodyTop = y + 28;
  const bodyH = link ? h - 48 : h - 36;
  doc.fillColor(MUTED).font(F.body).fontSize(7.5);
  doc.text(lines, x + 12, bodyTop, { width: w - 22, height: bodyH, lineGap: 1 });

  if (link) {
    doc.fillColor(MUTED).font(F.body).fontSize(7);
    t("Click to open:", x + 12, y + h - 16);
    const labelW = doc.widthOfString("Click to open: ");
    linkChip(link.label, link.url, x + 12 + labelW, y + h - 16, w - 24 - labelW);
  }
}

// Background
doc.rect(0, 0, PAGE_W, PAGE_H).fill(BG);
doc.save();
doc
  .moveTo(0, 0)
  .lineTo(110, 0)
  .lineTo(0, 64)
  .fillColor(YELLOW)
  .fillOpacity(0.35)
  .fill();
doc
  .moveTo(PAGE_W, 0)
  .lineTo(PAGE_W - 80, 0)
  .lineTo(PAGE_W, 50)
  .fillColor(RED)
  .fillOpacity(0.18)
  .fill();
doc.restore();
doc.fillOpacity(1);
doc.rect(0, 0, PAGE_W, 4).fill(YELLOW);
doc.rect(0, 4, PAGE_W, 2).fill(RED);

// Header
if (existsSync(FAN_EMBLEM)) {
  doc.image(FAN_EMBLEM, M, 12, { width: 72, height: 44, fit: [72, 44] });
} else {
  drawFanEmblem(M + 34, 54, 0.95, 1);
}

const textX = M + 86;
doc.fillColor(INK).font(F.display).fontSize(12);
t("CLEVERGRIT", textX, 16);
doc.fillColor(RED).font(F.displaySemi).fontSize(7.5);
t("WEB SERVICES", textX, 32);
doc.fillColor(MUTED).font(F.body).fontSize(7);
t("Built Smart. Driven by Grit.", textX, 45);

doc.fillColor(INK).font(F.display).fontSize(13);
t("HOW TO USE — CLICK TO TRY", M + 270, 18);
doc.fillColor(MUTED).font(F.body).fontSize(9);
t("REVE Clothing  ×  NOBODY", M + 270, 38);

doc.fillColor(RED).font(F.bodyBold).fontSize(8);
t("1-PAGER · GUIDE", PAGE_W - M - 140, 18, { width: 140, align: "right" });
doc.fillColor(MUTED).font(F.body).fontSize(7.5);
t(
  new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  PAGE_W - M - 140,
  34,
  { width: 140, align: "right" }
);

doc
  .strokeColor(LINE)
  .lineWidth(1)
  .moveTo(M, 70)
  .lineTo(PAGE_W - M, 70)
  .stroke();

// Start here — big clickable shortcuts
let y = 78;
sectionLabel(M, y, "START HERE — CLICK ANY BUTTON");
y += 14;

const shortcuts = [
  { label: "Home", path: "/", url: STAGING_URL },
  { label: "Shop", path: "/shop", url: `${STAGING_URL}/shop` },
  { label: "Affiliate", path: "/affiliate", url: `${STAGING_URL}/affiliate` },
  {
    label: "Register affiliate",
    path: "/affiliate?action=register",
    url: `${STAGING_URL}/affiliate?action=register`,
  },
  { label: "Admin", path: "/admin", url: `${STAGING_URL}/admin` },
];
const btnGap = 8;
const btnW = (PAGE_W - M * 2 - btnGap * (shortcuts.length - 1)) / shortcuts.length;
shortcuts.forEach((s, i) => {
  const bx = M + i * (btnW + btnGap);
  doc.roundedRect(bx, y, btnW, 40, 5).fill(CARD);
  doc
    .roundedRect(bx, y, btnW, 40, 5)
    .lineWidth(1.5)
    .strokeColor(RED)
    .stroke();
  // Invisible full-button link hit area via text link covering label
  doc.fillColor(INK).font(F.displaySemi).fontSize(8);
  t(s.label, bx + 6, y + 8, { link: s.url, width: btnW - 12 });
  doc.fillColor(RED).font(F.bodyBold).fontSize(7);
  t(s.path, bx + 6, y + 23, { link: s.url, underline: true, width: btnW - 12 });
});

doc.fillColor(MUTED).font(F.body).fontSize(7);
t(
  "Tip: No Vercel account needed. Just click — opens in your browser.",
  M,
  y + 46
);

// Three role columns
y += 62;
const colGap = 10;
const colW = (PAGE_W - M * 2 - colGap * 2) / 3;
const col1 = M;
const col2 = M + colW + colGap;
const col3 = M + (colW + colGap) * 2;

sectionLabel(col1, y, "IF YOU ARE SHOPPING");
sectionLabel(col2, y, "IF YOU ARE AN AFFILIATE");
sectionLabel(col3, y, "IF YOU ARE ADMIN");
y += 14;

const stepH = 66;

const shopperSteps = [
  {
    title: "Open the shop",
    body: "Click Shop above. Browse products. Open one and check photos, price, and sizes.",
    link: { label: "/shop", url: `${STAGING_URL}/shop` },
  },
  {
    title: "Buy something",
    body: "Pick a size → Add to cart → Checkout. Fill in your details and place the order.",
    link: { label: "/shop", url: `${STAGING_URL}/shop` },
  },
  {
    title: "Send payment proof",
    body: "If the site asks for a receipt/screenshot, upload it so admin can confirm payment.",
    link: null,
  },
  {
    title: "You’re good if…",
    body: "Photos load, product pages open, prices look right, and the cart works.",
    link: { label: "Home", url: STAGING_URL },
  },
];

const affiliateSteps = [
  {
    title: "Sign up",
    body: "Click Register affiliate. Choose a short code — exactly 8 letters/numbers (example: reve2026).",
    link: {
      label: "/affiliate?action=register",
      url: `${STAGING_URL}/affiliate?action=register`,
    },
  },
  {
    title: "Wait for approval",
    body: "You’ll see Pending. An admin must Approve you first. Then your dashboard unlocks.",
    link: { label: "/affiliate", url: `${STAGING_URL}/affiliate` },
  },
  {
    title: "Share your link",
    body: "Send people: homepage + ?ref=YOURCODE. When they buy, the sale is counted for you.",
    link: { label: "/?ref=YOURCODE", url: `${STAGING_URL}/?ref=YOURCODE` },
  },
  {
    title: "Check your stats",
    body: "Open Affiliate anytime to see referrals, commissions, and orders tagged to you.",
    link: { label: "/affiliate", url: `${STAGING_URL}/affiliate` },
  },
];

const adminSteps = [
  {
    title: "Log in to admin",
    body: "Use the admin email/password from your staging packet. Change password after first login.",
    link: { label: "/admin", url: `${STAGING_URL}/admin` },
  },
  {
    title: "Approve affiliates",
    body: "Go to Affiliates → Approve (or Suspend). You can also edit their commission rate.",
    link: { label: "/admin", url: `${STAGING_URL}/admin` },
  },
  {
    title: "Check orders",
    body: "Open Orders. If a sale came from an affiliate, you’ll see Aff: CODE on that order.",
    link: { label: "/admin", url: `${STAGING_URL}/admin` },
  },
  {
    title: "Manage the store",
    body: "Update products, stock, categories, and confirm payments. Staging is for testing only.",
    link: { label: "/admin", url: `${STAGING_URL}/admin` },
  },
];

function drawSteps(x, steps, accents) {
  let sy = y;
  steps.forEach((step, i) => {
    stepCard(
      x,
      sy,
      colW,
      stepH,
      i + 1,
      step.title,
      step.body,
      accents[i % accents.length],
      step.link
    );
    sy += stepH + 5;
  });
}

drawSteps(col1, shopperSteps, [YELLOW, RED, YELLOW, RED]);
drawSteps(col2, affiliateSteps, [RED, YELLOW, RED, YELLOW]);
drawSteps(col3, adminSteps, [YELLOW, RED, YELLOW, RED]);

// Quick tips footer bar
const tipY = PAGE_H - 48;
doc
  .strokeColor(LINE)
  .lineWidth(1)
  .moveTo(M, tipY - 6)
  .lineTo(PAGE_W - M, tipY - 6)
  .stroke();

doc.fillColor(INK).font(F.displaySemi).fontSize(7.5);
t("REMEMBER", M, tipY);
doc.fillColor(MUTED).font(F.body).fontSize(7);
t(
  "Affiliate code = exactly 8 characters.  ·  This is staging (test), not the live shop.  ·  Need help? Email clevergritph@gmail.com",
  M + 68,
  tipY,
  { width: PAGE_W - M * 2 - 68 }
);

doc.fillColor(MUTED).font(F.body).fontSize(6.5);
t(
  "CLEVERGRIT WEB SERVICES  ·  QUEZON, BUKIDNON",
  M,
  PAGE_H - 18
);
doc.fillColor(RED).font(F.displaySemi).fontSize(6.5);
t("BUILT SMART. DRIVEN BY GRIT.", PAGE_W - M - 150, PAGE_H - 18, {
  width: 150,
  align: "right",
});

drawFanEmblem(PAGE_W - 48, PAGE_H - 70, 1.1, 0.06);

const range = doc.bufferedPageRange();
if (range.count > 1) {
  throw new Error(`PDF spilled to ${range.count} pages; tighten layout.`);
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
    fonts: ["Poppins", "Aptos Narrow"],
  })
);
