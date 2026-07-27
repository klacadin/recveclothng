import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { vouchers } from "@/db/schema";
import {
  TEST_VOUCHER_CODE,
  TEST_VOUCHER_DISCOUNT_PERCENT,
} from "@/config/constants";

type CartItemInput = {
  product_id: string;
  quantity: number;
  unit_price: number;
  category?: string | null;
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const cleanCode = String(body?.code || "")
      .trim()
      .toUpperCase();
    const subtotal = Math.max(0, Number(body?.subtotal) || 0);
    const items: CartItemInput[] = Array.isArray(body?.items)
      ? body.items
          .map(
            (i: {
              product_id?: string;
              quantity?: number;
              unit_price?: number;
              category?: string | null;
            }) => ({
              product_id: String(i.product_id ?? ""),
              quantity: Math.max(0, Number(i.quantity) || 0),
              unit_price: Math.max(0, Number(i.unit_price) || 0),
              category: i.category ?? null,
            })
          )
          .filter((i: CartItemInput) => i.product_id)
      : [];

    if (!cleanCode) {
      return json({
        valid: false,
        discount_amount: 0,
        message: "Voucher code is required",
      });
    }

    // Built-in test voucher (no DB row required)
    if (cleanCode === TEST_VOUCHER_CODE.toUpperCase()) {
      const eligible =
        items.length > 0
          ? items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
          : subtotal;
      const discountAmount = Math.floor(
        eligible * (Math.min(100, TEST_VOUCHER_DISCOUNT_PERCENT) / 100)
      );
      return json({
        valid: true,
        discount_amount: discountAmount,
        message: `${TEST_VOUCHER_DISCOUNT_PERCENT}% off`,
        code: TEST_VOUCHER_CODE.toUpperCase(),
      });
    }

    const db = getDb();
    const [voucher] = await db
      .select()
      .from(vouchers)
      .where(sql`upper(${vouchers.code}) = ${cleanCode}`)
      .limit(1);

    if (!voucher) {
      return json({
        valid: false,
        discount_amount: 0,
        message: "Voucher not found",
      });
    }

    if (!voucher.isActive) {
      return json({
        valid: false,
        discount_amount: 0,
        message: "Voucher has expired or is no longer valid",
      });
    }

    if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
      return json({
        valid: false,
        discount_amount: 0,
        message: "Voucher has expired",
      });
    }

    if (
      voucher.maxUses != null &&
      (voucher.usedCount ?? 0) >= voucher.maxUses
    ) {
      return json({
        valid: false,
        discount_amount: 0,
        message: "Voucher usage limit reached",
      });
    }

    const eligibleAmount =
      items.length > 0
        ? items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
        : subtotal;

    if (eligibleAmount <= 0) {
      return json({
        valid: false,
        discount_amount: 0,
        message: "Voucher does not apply to any items in your cart",
      });
    }

    const val = Number(voucher.discountValue);
    let discountAmount = 0;
    if (voucher.discountType === "percent") {
      discountAmount = Math.floor(
        eligibleAmount * (Math.min(100, val) / 100)
      );
    } else {
      discountAmount = Math.min(eligibleAmount, val);
    }

    return json({
      valid: true,
      discount_amount: discountAmount,
      message:
        voucher.discountType === "percent"
          ? `${voucher.discountValue}% off`
          : `₱${voucher.discountValue} off`,
      code: voucher.code,
    });
  } catch (e) {
    console.error("vouchers/validate POST", e);
    return json(
      {
        valid: false,
        discount_amount: 0,
        message: "Voucher service temporarily unavailable",
      },
      500
    );
  }
}
