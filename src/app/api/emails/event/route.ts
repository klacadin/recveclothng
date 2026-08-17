import { NextResponse } from "next/server";
import { getAppBaseUrl, SERVER_BASE_URL } from "@/config/constants";

type EventEmailRequest = {
  type?: string;
  customer_email: string;
  customer_name: string;
  event_title: string;
  starts_at?: string | Date;
  location?: string | null;
  check_in_code: string;
  final_amount?: number;
  payment_status?: string;
  registration_id: string;
};

function formatPrice(price: number) {
  return `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatWhen(value?: string | Date) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });
}

function confirmationHtml(data: EventEmailRequest) {
  const ticketUrl = `${process.env.APP_URL || SERVER_BASE_URL}/events/registered?id=${data.registration_id}`;
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#111">
  <h1>You're in, ${data.customer_name}!</h1>
  <p>Your registration for <strong>${data.event_title}</strong> is confirmed.</p>
  <p>
    ${data.starts_at ? `When: ${formatWhen(data.starts_at)}<br/>` : ""}
    ${data.location ? `Where: ${data.location}<br/>` : ""}
    Amount: ${formatPrice(Number(data.final_amount || 0))}<br/>
    Payment: ${data.payment_status === "paid" ? "Paid" : "Pending"}
  </p>
  <p style="font-size:22px;letter-spacing:0.2em;font-weight:bold">Check-in code: ${data.check_in_code}</p>
  <p>Show this code at the door. <a href="${ticketUrl}">View your ticket</a></p>
  <p style="color:#6b7280;font-size:14px">Reve Clothing x Nobody — From Nobody to Somebody</p>
  </body></html>`;
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as EventEmailRequest;
    if (!data.customer_email || !data.event_title || !data.check_in_code) {
      return NextResponse.json({ error: "Missing email fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — event email skipped", data.registration_id);
      return NextResponse.json({ success: true, skipped: true });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "REVE <shop@reveclothingxnobody.com>",
        to: [data.customer_email],
        subject: `Event registration — ${data.event_title}`,
        html: confirmationHtml(data),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend event email error", err);
      return NextResponse.json({ error: "Email send failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true, app_url: getAppBaseUrl() });
  } catch (e) {
    console.error("emails/event", e);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
