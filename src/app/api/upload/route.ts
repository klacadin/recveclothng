import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";
import { MAX_UPLOAD_SIZE_BYTES } from "@/config/constants";

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

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json({ error: "File exceeds 2MB limit" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const pathname = `${folder}/${Date.now()}-${safeName}`;
    const blob = await put(pathname, file, {
      access: folder === "payment-proofs" ? "public" : "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (e) {
    console.error("blob upload", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
