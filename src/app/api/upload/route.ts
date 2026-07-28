import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";
import sharp from "sharp";
import { MAX_UPLOAD_SIZE_BYTES, MAX_UPLOAD_SIZE_MB } from "@/config/constants";
import { buildSeoBlobPathname } from "@/utils/seoImageFilename";

const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
const MAX_DIM = 1600;
const TARGET_BYTES = 350 * 1024;

async function optimizeImageBuffer(
  input: Buffer,
  contentType: string
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  if (!contentType.startsWith("image/") || contentType === "image/svg+xml") {
    return {
      buffer: input,
      contentType,
      ext: contentType.includes("svg") ? "svg" : "bin",
    };
  }

  let pipeline = sharp(input, { failOn: "none" }).rotate();
  const meta = await pipeline.metadata();
  const w = meta.width || MAX_DIM;
  const h = meta.height || MAX_DIM;
  if (w > MAX_DIM || h > MAX_DIM) {
    pipeline = pipeline.resize({
      width: MAX_DIM,
      height: MAX_DIM,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Flatten transparency onto white for consistent product shots
  pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });

  let quality = 82;
  let buffer = await pipeline.webp({ quality, effort: 6 }).toBuffer();

  while (buffer.length > TARGET_BYTES && quality > 55) {
    quality -= 7;
    buffer = await sharp(input, { failOn: "none" })
      .rotate()
      .resize({
        width: MAX_DIM,
        height: MAX_DIM,
        fit: "inside",
        withoutEnlargement: true,
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .webp({ quality, effort: 6 })
      .toBuffer();
  }

  while (buffer.length > MAX_UPLOAD_SIZE_BYTES && quality > 40) {
    quality -= 8;
    buffer = await sharp(input, { failOn: "none" })
      .rotate()
      .resize({
        width: Math.round(MAX_DIM * 0.85),
        height: Math.round(MAX_DIM * 0.85),
        fit: "inside",
        withoutEnlargement: true,
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .webp({ quality, effort: 6 })
      .toBuffer();
  }

  return { buffer, contentType: "image/webp", ext: "webp" };
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "Blob storage not configured" }, { status: 500 });
    }

    const form = await req.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "uploads");
    const seoName = String(form.get("seoName") || "");
    const seoSku = String(form.get("seoSku") || "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (file.size > MAX_SOURCE_BYTES) {
      return NextResponse.json(
        { error: "Source file exceeds 25MB limit" },
        { status: 400 }
      );
    }

    const ab = await file.arrayBuffer();
    let buffer = Buffer.from(ab);
    let contentType = file.type || "application/octet-stream";
    let ext =
      (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "bin";

    const isImage =
      contentType.startsWith("image/") && contentType !== "image/svg+xml";

    if (isImage) {
      const optimized = await optimizeImageBuffer(buffer, contentType);
      buffer = Buffer.from(optimized.buffer);
      contentType = optimized.contentType;
      ext = optimized.ext;
    }

    if (buffer.length > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_UPLOAD_SIZE_MB}MB limit after optimization` },
        { status: 400 }
      );
    }

    const pathname = buildSeoBlobPathname({
      folder,
      originalName: file.name,
      name: seoName || undefined,
      sku: seoSku || undefined,
      ext,
      uniqueSuffix: Date.now().toString(36).slice(-6),
    });

    const blob = await put(pathname, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      size: buffer.length,
      contentType,
    });
  } catch (e) {
    console.error("blob upload", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
