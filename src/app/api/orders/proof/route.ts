import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import { orders } from "@/db/schema";
import { MAX_UPLOAD_SIZE_BYTES } from "@/config/constants";

/** Statuses where a customer can still (re)submit proof of payment. */
const PROOF_ELIGIBLE_STATUSES = ["new", "pending_payment", "for_verification"] as const;

/**
 * Upload payment proof (Blob when configured; otherwise stores a data URL is not allowed).
 * Updates order to for_verification.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const orderId = String(form.get("order_id") || "");

    if (!orderId || !(file instanceof File)) {
      return NextResponse.json({ error: "order_id and file required" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json({ error: "File exceeds 2MB limit" }, { status: 400 });
    }

    let url: string;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await put(`payment-proofs/${orderId}-${Date.now()}-${safeName}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      url = blob.url;
    } else {
      return NextResponse.json(
        { error: "Blob storage not configured (BLOB_READ_WRITE_TOKEN)" },
        { status: 500 }
      );
    }

    const db = getDb();
    const [updated] = await db
      .update(orders)
      .set({
        proofOfPaymentUrl: url,
        proofUploadedAt: new Date(),
        status: "for_verification",
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, orderId), inArray(orders.status, [...PROOF_ELIGIBLE_STATUSES])))
      .returning();

    if (!updated) {
      // Either the order doesn't exist, or it has already moved past the
      // proof-of-payment stage (paid/shipped/cancelled) — never regress it.
      return NextResponse.json(
        { error: "Order not found or no longer accepting proof of payment" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      proof_of_payment_url: url,
      status: updated.status,
    });
  } catch (e) {
    console.error("proof upload", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
