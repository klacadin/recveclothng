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
  return (
    hitData.status === "completed" ||
    hitData.status === "succeeded" ||
    Boolean(
      hitData.payments?.some((p) => p.status === "succeeded" || p.status === "completed")
    )
  );
}
