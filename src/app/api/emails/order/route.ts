import { NextResponse } from "next/server";
import { SERVER_BASE_URL } from "@/config/constants";

type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  size?: string | null;
};

type EmailRequest = {
  type: "confirmation" | "status_update" | "proof_reminder" | "payment_reminder";
  order_id: string;
  customer_email: string;
  customer_name: string;
  order_number: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping_fee?: number;
  total?: number;
  new_status?: string;
  payment_method?: string;
  shipping_address?: string;
};

function formatPrice(price: number) {
  return `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function confirmationHtml(data: EmailRequest) {
  const itemsHtml =
    data.items
      ?.map(
        (item) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${item.product_name}${item.size ? ` (Size ${item.size})` : ""
          }</td>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPrice(item.unit_price)}</td>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPrice(item.total_price)}</td>
    </tr>`
      )
      .join("") || "";

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#111">
  <h1>Thanks for your order, ${data.customer_name}!</h1>
  <p>Order <strong>${data.order_number}</strong> is confirmed.</p>
  <table style="width:100%;border-collapse:collapse">${itemsHtml}</table>
  <p>Subtotal: ${formatPrice(data.subtotal || 0)}<br/>
  Shipping: ${formatPrice(data.shipping_fee || 0)}<br/>
  <strong>Total: ${formatPrice(data.total || 0)}</strong></p>
  <p><a href="${process.env.APP_URL || SERVER_BASE_URL}/my-orders">View your orders</a></p>
  <p style="color:#6b7280;font-size:14px">REVE Clothing — From Nobody to Somebody</p>
  </body></html>`;
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as EmailRequest;
    if (!data.customer_email || !data.order_number) {
      return NextResponse.json({ error: "Missing email fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — email skipped", data.order_number);
      return NextResponse.json({ success: true, skipped: true });
    }

    const html =
      data.type === "confirmation"
        ? confirmationHtml(data)
        : `<p>Order ${data.order_number} update: ${data.new_status || data.type}</p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "REVE <shop@reveclothingxnobody.com>",
        to: [data.customer_email],
        subject:
          data.type === "confirmation"
            ? `Order confirmed — ${data.order_number}`
            : `Order update — ${data.order_number}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error", err);
      return NextResponse.json({ error: "Email send failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("send-order-email", e);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
