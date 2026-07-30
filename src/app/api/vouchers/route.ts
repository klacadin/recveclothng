import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { vouchers } from "@/db/schema";

async function requireAdmin() {
  try {
    const { userId } = await auth();
    if (!userId) return false;
    const user = await currentUser();
    return (user?.publicMetadata?.role as string) === "admin";
  } catch {
    return process.env.ALLOW_DEV_ADMIN === "1";
  }
}

function mapVoucher(row: typeof vouchers.$inferSelect) {
  return {
    id: row.id,
    code: row.code,
    discount_type: (row.discountType === "fixed" ? "fixed" : "percent") as
      | "percent"
      | "fixed",
    discount_value: Number(row.discountValue),
    min_order_amount: row.minOrderAmount != null ? Number(row.minOrderAmount) : 0,
    expires_at: row.expiresAt ? new Date(row.expiresAt).toISOString() : null,
    is_active: row.isActive,
    max_uses: row.maxUses,
    times_used: row.usedCount ?? 0,
    description: row.description,
    product_ids: Array.isArray(row.productIds) ? row.productIds : [],
    category_ids: Array.isArray(row.categoryIds) ? row.categoryIds : [],
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const db = getDb();
    const rows = await db.select().from(vouchers).orderBy(desc(vouchers.createdAt));
    return NextResponse.json(rows.map(mapVoucher));
  } catch (e) {
    console.error("vouchers GET", e);
    return NextResponse.json({ error: "Failed to load vouchers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const code = String(body.code || "")
      .trim()
      .toUpperCase();
    if (!code) {
      return NextResponse.json({ error: "Voucher code is required" }, { status: 400 });
    }
    const discountType = body.discount_type === "fixed" ? "fixed" : "percent";
    const discountValue = Number(body.discount_value);
    if (!(discountValue > 0)) {
      return NextResponse.json({ error: "Discount value must be greater than 0" }, { status: 400 });
    }
    if (discountType === "percent" && discountValue > 100) {
      return NextResponse.json({ error: "Percent discount cannot exceed 100%" }, { status: 400 });
    }

    const db = getDb();
    const [row] = await db
      .insert(vouchers)
      .values({
        code,
        discountType,
        discountValue: String(discountValue),
        minOrderAmount: String(body.min_order_amount ?? 0),
        description: body.description?.trim() || null,
        productIds: Array.isArray(body.product_ids) ? body.product_ids : [],
        categoryIds: Array.isArray(body.category_ids) ? body.category_ids : [],
        isActive: body.is_active ?? true,
        maxUses: body.max_uses != null && body.max_uses !== "" ? Number(body.max_uses) : null,
        expiresAt: body.expires_at ? new Date(body.expires_at) : null,
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(mapVoucher(row), { status: 201 });
  } catch (e) {
    console.error("vouchers POST", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (/unique|duplicate/i.test(msg)) {
      return NextResponse.json({ error: "Voucher code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create voucher" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (body.code != null) {
      patch.code = String(body.code).trim().toUpperCase();
    }
    if (body.discount_type != null) {
      patch.discountType = body.discount_type === "fixed" ? "fixed" : "percent";
    }
    if (body.discount_value != null) {
      patch.discountValue = String(Number(body.discount_value));
    }
    if (body.min_order_amount !== undefined) {
      patch.minOrderAmount = String(body.min_order_amount ?? 0);
    }
    if (body.description !== undefined) {
      patch.description = body.description?.trim() || null;
    }
    if (body.product_ids !== undefined) {
      patch.productIds = Array.isArray(body.product_ids) ? body.product_ids : [];
    }
    if (body.category_ids !== undefined) {
      patch.categoryIds = Array.isArray(body.category_ids) ? body.category_ids : [];
    }
    if (body.is_active !== undefined) patch.isActive = !!body.is_active;
    if (body.max_uses !== undefined) {
      patch.maxUses =
        body.max_uses != null && body.max_uses !== "" ? Number(body.max_uses) : null;
    }
    if (body.expires_at !== undefined) {
      patch.expiresAt = body.expires_at ? new Date(body.expires_at) : null;
    }

    const db = getDb();
    const [row] = await db
      .update(vouchers)
      .set(patch as never)
      .where(eq(vouchers.id, id))
      .returning();

    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapVoucher(row));
  } catch (e) {
    console.error("vouchers PATCH", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (/unique|duplicate/i.test(msg)) {
      return NextResponse.json({ error: "Voucher code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update voucher" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const id = String(body.id || searchParams.get("id") || "");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const db = getDb();
    const removed = await db.delete(vouchers).where(eq(vouchers.id, id)).returning({ id: vouchers.id });
    if (!removed.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true, id });
  } catch (e) {
    console.error("vouchers DELETE", e);
    return NextResponse.json({ error: "Failed to delete voucher" }, { status: 500 });
  }
}
