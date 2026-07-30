import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

/**
 * Admin HitPay payment-request status lookup (replaces retired edge function).
 */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const paymentRequestId = String(
      body.payment_request_id || body.id || ""
    ).trim();
    if (!paymentRequestId) {
      return NextResponse.json(
        { error: "payment_request_id required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.HITPAY_API_KEY || process.env.VITE_HITPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    const isSandbox = process.env.HITPAY_SANDBOX === "true";
    const hitpayBase = isSandbox
      ? "https://api.sandbox.hit-pay.com"
      : "https://api.hit-pay.com";

    const hitRes = await fetch(
      `${hitpayBase}/v1/payment-requests/${encodeURIComponent(paymentRequestId)}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Business-Api-Key": apiKey,
        },
      }
    );

    const data = await hitRes.json().catch(() => ({}));
    if (!hitRes.ok) {
      return NextResponse.json(
        {
          error: data?.message || "HitPay lookup failed",
          details: data,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      status: data.status,
      payment_request_id: data.id || paymentRequestId,
      payment_status: data.status,
      reference_number: data.reference_number,
      amount: data.amount,
      currency: data.currency,
      payments: data.payments,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  } catch (e) {
    console.error("hitpay status", e);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
