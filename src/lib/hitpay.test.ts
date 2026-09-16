import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import {
  hitPayPaymentReference,
  isHitPayPaid,
  isHitPayWebhookSuccess,
  parseHitPayWebhookBody,
  unwrapHitPayWebhookPayload,
  verifyHitPayWebhookSignature,
} from "./hitpay";

describe("HitPay webhook parsing", () => {
  it("reads JSON payment requests and wrapped dashboard payloads", () => {
    const direct = parseHitPayWebhookBody(
      JSON.stringify({
        id: "pay_1",
        status: "completed",
        reference_number: "evt_abc",
      }),
      "application/json"
    );
    expect(direct.reference_number).toBe("evt_abc");

    const wrapped = unwrapHitPayWebhookPayload({
      event: "payment_request.completed",
      data: { id: "pay_2", status: "succeeded", reference_number: "evt_def" },
    });
    expect(wrapped.id).toBe("pay_2");
    expect(wrapped.status).toBe("succeeded");
  });

  it("reads legacy form-encoded webhooks", () => {
    const payload = parseHitPayWebhookBody(
      "payment_request_id=pr_1&status=completed&reference_number=evt_abc&hmac=abc",
      "application/x-www-form-urlencoded"
    );
    expect(payload.payment_request_id).toBe("pr_1");
    expect(payload.reference_number).toBe("evt_abc");
  });

  it("treats succeeded charges as paid even without completed status", () => {
    expect(isHitPayPaid({ status: "succeeded" })).toBe(true);
    expect(isHitPayWebhookSuccess({ status: "pending", payments: [{ status: "succeeded" }] })).toBe(true);
    expect(isHitPayWebhookSuccess({ status: "pending" }, "payment_request.completed")).toBe(true);
    expect(isHitPayWebhookSuccess({ status: "failed" }, "payment_request.completed")).toBe(false);
  });

  it("reads the payment_id field from real form-encoded payment-request webhooks", () => {
    const payload = parseHitPayWebhookBody(
      "payment_id=charge_1&payment_request_id=pr_1&status=completed&reference_number=evt_abc&hmac=abc",
      "application/x-www-form-urlencoded"
    );
    expect(hitPayPaymentReference(payload)).toBe("charge_1");
  });

  it("verifies both JSON header signatures and legacy hmac fields", () => {
    const salt = "webhook-salt";
    const rawBody = JSON.stringify({ id: "pay_1", status: "completed" });
    const headerSig = createHmac("sha256", salt).update(rawBody).digest("hex");
    expect(
      verifyHitPayWebhookSignature({
        rawBody,
        signatureHeader: headerSig,
        payload: { id: "pay_1", status: "completed" },
        salt,
      })
    ).toBe(true);

    const fields = { amount: "80.00", payment_request_id: "pr_1", reference_number: "evt_abc", status: "completed" };
    const valuesOnly = Object.keys(fields)
      .sort()
      .map((key) => fields[key as keyof typeof fields])
      .join("");
    const hmac = createHmac("sha256", salt).update(valuesOnly).digest("hex");
    expect(
      verifyHitPayWebhookSignature({
        rawBody: new URLSearchParams({ ...fields, hmac }).toString(),
        signatureHeader: null,
        payload: { ...fields, hmac },
        salt,
      })
    ).toBe(true);
  });
});
