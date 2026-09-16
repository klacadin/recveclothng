import { createHmac, timingSafeEqual } from "crypto";
import { getAppBaseUrl } from "@/config/constants";

export function getHitPayApiKey() {
  return process.env.HITPAY_API_KEY || process.env.VITE_HITPAY_API_KEY || "";
}

export function getHitPayBaseUrl() {
  return process.env.HITPAY_SANDBOX === "true"
    ? "https://api.sandbox.hit-pay.com"
    : "https://api.hit-pay.com";
}

export async function createHitPayPaymentRequest(input: {
  amount: number;
  email: string;
  name: string;
  purpose: string;
  referenceNumber: string;
  redirectUrl: string;
}): Promise<{ id?: string; url?: string }> {
  const apiKey = getHitPayApiKey();
  if (!apiKey) {
    throw new Error("Payment service is not configured");
  }

  const appUrl = getAppBaseUrl();
  const isSandbox = process.env.HITPAY_SANDBOX === "true";
  const form = new URLSearchParams();
  form.set("amount", input.amount.toFixed(2));
  form.set("currency", "PHP");
  form.set("email", input.email);
  form.set("name", input.name);
  form.set("purpose", input.purpose);
  form.set("reference_number", input.referenceNumber);
  form.set("redirect_url", input.redirectUrl);
  form.set("webhook", `${appUrl}/api/webhooks/hitpay`);
  form.set("send_email", "false");
  form.set("send_sms", "false");

  if (isSandbox) {
    form.append("payment_methods[]", "card");
    form.append("payment_methods[]", "paynow_online");
  }

  const hitRes = await fetch(`${getHitPayBaseUrl()}/v1/payment-requests`, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Business-Api-Key": apiKey,
    },
    body: form.toString(),
  });

  if (!hitRes.ok) {
    const errText = await hitRes.text();
    console.error("HitPay error", errText);
    throw new Error("Failed to create payment");
  }

  return (await hitRes.json()) as { id?: string; url?: string };
}

export async function fetchHitPayPaymentRequest(paymentRequestId: string) {
  const apiKey = getHitPayApiKey();
  if (!apiKey) {
    throw new Error("Payment service is not configured");
  }

  const hitRes = await fetch(
    `${getHitPayBaseUrl()}/v1/payment-requests/${encodeURIComponent(paymentRequestId)}`,
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Business-Api-Key": apiKey,
      },
    }
  );

  if (!hitRes.ok) {
    const errText = await hitRes.text();
    console.error("HitPay reconcile fetch failed", hitRes.status, errText);
    throw new Error("Failed to verify payment");
  }

  return (await hitRes.json()) as {
    status?: string;
    id?: string;
    payments?: Array<{ id?: string; status?: string }>;
  };
}

export function isHitPayPaid(hitData: {
  status?: string;
  payments?: Array<{ status?: string }>;
}) {
  const status = String(hitData.status || "").toLowerCase();
  return (
    status === "completed" ||
    status === "succeeded" ||
    status === "paid" ||
    Boolean(
      hitData.payments?.some((p) => {
        const paymentStatus = String(p.status || "").toLowerCase();
        return paymentStatus === "succeeded" || paymentStatus === "completed" || paymentStatus === "paid";
      })
    )
  );
}

export type HitPayWebhookPayload = {
  id?: string;
  payment_id?: string;
  status?: string;
  event?: string;
  hmac?: string;
  reference_number?: string;
  reference_id?: string;
  payment_request_id?: string;
  payments?: Array<{ id?: string; status?: string }>;
  data?: HitPayWebhookPayload;
};

export function unwrapHitPayWebhookPayload(payload: HitPayWebhookPayload): HitPayWebhookPayload {
  const nested = payload.data;
  if (nested && typeof nested === "object" && (nested.status || nested.reference_number || nested.id || nested.payments)) {
    return {
      ...nested,
      event: nested.event || payload.event,
      hmac: nested.hmac || payload.hmac,
    };
  }
  return payload;
}

export function parseHitPayWebhookBody(rawBody: string, contentType?: string | null): HitPayWebhookPayload {
  const type = String(contentType || "").toLowerCase();
  const trimmed = rawBody.trim();
  if (type.includes("json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return unwrapHitPayWebhookPayload(JSON.parse(trimmed) as HitPayWebhookPayload);
  }
  const params = new URLSearchParams(rawBody);
  return Object.fromEntries(params.entries()) as HitPayWebhookPayload;
}

function hmacHex(secret: string, message: string) {
  return createHmac("sha256", secret).update(message).digest("hex");
}

function signaturesMatch(expected: string, received: string) {
  const left = Buffer.from(expected);
  const right = Buffer.from(received);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyHitPayWebhookSignature(input: {
  rawBody: string;
  signatureHeader?: string | null;
  payload: HitPayWebhookPayload;
  salt?: string | null;
}) {
  const salt = input.salt || process.env.HITPAY_WEBHOOK_SALT || process.env.VITE_HITPAY_WEBHOOK_SALT || "";
  if (!salt) return false;

  const headerSig = String(input.signatureHeader || "").trim();
  if (headerSig && signaturesMatch(hmacHex(salt, input.rawBody), headerSig)) {
    return true;
  }

  const bodyHmac = String(input.payload.hmac || "").trim();
  if (!bodyHmac) return Boolean(headerSig && signaturesMatch(hmacHex(salt, input.rawBody), headerSig));

  const fields = { ...input.payload } as Record<string, unknown>;
  delete fields.hmac;
  const keys = Object.keys(fields).sort();
  const valuesOnly = keys.map((key) => String(fields[key] ?? "")).join("");
  const keyValues = keys.map((key) => `${key}${String(fields[key] ?? "")}`).join("");
  return signaturesMatch(hmacHex(salt, valuesOnly), bodyHmac) || signaturesMatch(hmacHex(salt, keyValues), bodyHmac);
}

export function isHitPayWebhookSuccess(payload: HitPayWebhookPayload, eventTypeHeader?: string | null) {
  const status = String(payload.status || "").toLowerCase();
  const eventType = String(eventTypeHeader || payload.event || "").toLowerCase();
  if (["failed", "expired", "canceled", "cancelled"].includes(status)) return false;
  if (eventType.includes("failed") || eventType.includes("expired") || eventType.includes("cancel")) return false;
  if (isHitPayPaid(payload)) return true;
  return eventType.includes("completed") || eventType.includes("succeeded");
}

export function hitPayPaymentRequestId(payload: HitPayWebhookPayload) {
  return String(payload.payment_request_id || payload.id || "").trim() || null;
}

export function hitPayReferenceNumber(payload: HitPayWebhookPayload) {
  return String(payload.reference_number || payload.reference_id || "").trim() || null;
}

export function hitPayPaymentReference(payload: HitPayWebhookPayload) {
  return payload.payment_id || payload.payments?.[0]?.id || payload.id || null;
}
