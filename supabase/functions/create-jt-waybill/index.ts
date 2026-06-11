/**
 * J&T Express - Create Waybill Edge Function
 *
 * Triggered by:
 * 1. Supabase Database Webhook on orders UPDATE (status -> preparing/packed)
 * 2. Direct invoke with { order_id } from Admin "Create waybill" button
 *
 * Fetches order, calls J&T Order API, saves waybill_number to orders.
 *
 * Secrets: JNT_API_ACCOUNT, JNT_PRIVATE_KEY, JNT_API_URL, JNT_API_ENABLED,
 *          JNT_SENDER_NAME, JNT_SENDER_PHONE, JNT_SENDER_ADDRESS,
 *          JNT_WEBHOOK_SECRET
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SupabaseWebhookPayload {
  type: "UPDATE";
  table: string;
  schema: string;
  record: Record<string, unknown>;
  old_record: Record<string, unknown>;
}

interface DirectInvokePayload {
  order_id: string;
}

interface OrderWithItems {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: string;
  total: number;
  payment_method: string;
  waybill_number: string | null;
  status: string;
  order_items?: Array<{ product_name: string; quantity: number }>;
}

const READY_STATUSES = ["preparing", "packed"];
const DEFAULT_PARCEL_WEIGHT_KG = 0.5;

function isWebhookPayload(body: unknown): body is SupabaseWebhookPayload {
  const b = body as Record<string, unknown>;
  return b?.type === "UPDATE" && b?.table === "orders" && b?.record != null;
}

function isDirectInvokePayload(body: unknown): body is DirectInvokePayload {
  const b = body as Record<string, unknown>;
  return typeof b?.order_id === "string";
}

function shouldProcessFromWebhook(record: Record<string, unknown>, oldRecord: Record<string, unknown>): boolean {
  const status = record?.status as string;
  const waybill = record?.waybill_number;
  const oldWaybill = oldRecord?.waybill_number;
  return (
    READY_STATUSES.includes(status) &&
    (waybill == null || waybill === "") &&
    (oldWaybill == null || oldWaybill === "")
  );
}

function bearerToken(req: Request): string | null {
  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

async function requireAdmin(req: Request, supabase: ReturnType<typeof createClient>) {
  const token = bearerToken(req);
  if (!token) {
    return { ok: false, response: unauthorized("Missing authorization token") };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return { ok: false, response: unauthorized("Invalid authorization token") };
  }

  const { data: role, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !role) {
    return { ok: false, response: unauthorized("Admin access required") };
  }

  return { ok: true, response: null };
}

function verifyWebhookSecret(req: Request): Response | null {
  const configuredSecret = Deno.env.get("JNT_WEBHOOK_SECRET");
  if (!configuredSecret) {
    return new Response(
      JSON.stringify({ error: "J&T webhook verification is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const suppliedSecret =
    req.headers.get("x-jnt-webhook-secret") ??
    req.headers.get("x-webhook-secret") ??
    "";

  if (suppliedSecret !== configuredSecret) {
    return unauthorized("Invalid webhook signature");
  }

  return null;
}

function unauthorized(message: string) {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

/**
 * Call J&T Order API to create waybill.
 * Returns waybill number or null on failure.
 * Stub implementation until J&T PH API docs are obtained.
 */
async function callJtOrderApi(order: OrderWithItems): Promise<string | null> {
  const apiEnabled = Deno.env.get("JNT_API_ENABLED")?.toLowerCase() === "true";
  if (!apiEnabled) {
    console.log("J&T API disabled (JNT_API_ENABLED not true). Skipping waybill creation.");
    return null;
  }

  const apiAccount = Deno.env.get("JNT_API_ACCOUNT");
  const privateKey = Deno.env.get("JNT_PRIVATE_KEY");
  const apiUrl = Deno.env.get("JNT_API_URL");
  const senderName = Deno.env.get("JNT_SENDER_NAME") ?? "REVE CLOTHING SHOP";
  const senderPhone = Deno.env.get("JNT_SENDER_PHONE") ?? "09554465207";
  const senderAddress = Deno.env.get("JNT_SENDER_ADDRESS") ?? "p5 north pob. Maramag, Bukidnon";

  if (!apiAccount || !privateKey || !apiUrl) {
    console.warn("J&T API credentials not configured. Set JNT_API_ACCOUNT, JNT_PRIVATE_KEY, JNT_API_URL.");
    return null;
  }

  const itemsDesc = (order.order_items ?? [])
    .map((i) => `${i.product_name} x${i.quantity}`)
    .join("; ") || "Order";

  // Build data_param per J&T API (structure may vary by region - adjust when PH docs available)
  const dataParam = {
    sender: { name: senderName, phone: senderPhone, address: senderAddress },
    receiver: {
      name: order.customer_name,
      phone: order.customer_phone || "",
      address: order.shipping_address,
    },
    parcel: { weight_kg: DEFAULT_PARCEL_WEIGHT_KG, description: itemsDesc },
    cod_amount: order.payment_method === "cod" ? order.total : 0,
    reference: order.order_number,
    currency: "PHP",
  };

  // Signature: MD5(data_param + privateKey) then Base64 - exact spec from J&T docs
  const dataStr = JSON.stringify(dataParam);
  const signStr = dataStr + privateKey;
  const { default: md5 } = await import("https://esm.sh/md5@2.3.0");
  const hexHash = md5(signStr) as string;
  // Base64 of raw MD5 bytes (hex -> bytes -> base64)
  const bytes = new Uint8Array(hexHash.length / 2);
  for (let i = 0; i < hexHash.length; i += 2) {
    bytes[i / 2] = parseInt(hexHash.slice(i, i + 2), 16);
  }
  const signature = btoa(String.fromCharCode(...bytes));

  const formBody = new URLSearchParams({
    apiAccount,
    data_param: dataStr,
    signature,
  }).toString();

  const endpoint = apiUrl.replace(/\/$/, "") + "/api/order/createOrder";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    });

    const json = await res.json().catch(() => ({}));
    console.log("J&T API response:", res.status, JSON.stringify(json));

    if (!res.ok) {
      console.error("J&T API error:", json);
      return null;
    }

    // Response structure varies - common fields: waybill_no, waybill_number, billcode
    const waybill =
      (json as Record<string, unknown>).waybill_no ??
      (json as Record<string, unknown>).waybill_number ??
      (json as Record<string, unknown>).billcode ??
      (Array.isArray(json?.data) && json.data[0] ? (json.data[0] as Record<string, unknown>).waybill_no : null);

    return typeof waybill === "string" ? waybill : null;
  } catch (err) {
    console.error("J&T API request failed:", err);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));

    let orderId: string | null = null;

    if (isWebhookPayload(body)) {
      const secretError = verifyWebhookSecret(req);
      if (secretError) return secretError;

      const { record, old_record } = body;
      if (!shouldProcessFromWebhook(record, old_record)) {
        return new Response(JSON.stringify({ success: true, message: "No action needed" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      orderId = record.id as string;
    } else if (isDirectInvokePayload(body)) {
      const admin = await requireAdmin(req, supabase);
      if (!admin.ok) return admin.response;

      orderId = body.order_id;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid payload. Expected webhook payload or { order_id }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        customer_phone,
        shipping_address,
        total,
        payment_method,
        waybill_number,
        status
      `)
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      console.error("Order fetch error:", fetchError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orderTyped = order as OrderWithItems;

    if (orderTyped.waybill_number) {
      return new Response(
        JSON.stringify({ success: true, waybill_number: orderTyped.waybill_number, message: "Already has waybill" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!READY_STATUSES.includes(orderTyped.status)) {
      return new Response(
        JSON.stringify({ error: `Order status must be preparing or packed (current: ${orderTyped.status})` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: items } = await supabase
      .from("order_items")
      .select("product_name, quantity")
      .eq("order_id", orderId);

    const orderWithItems: OrderWithItems = { ...orderTyped, order_items: items ?? [] };

    const waybillNumber = await callJtOrderApi(orderWithItems);

    if (waybillNumber) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          waybill_number: waybillNumber,
          status: "for_pickup",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Failed to update order with waybill:", updateError);
        return new Response(
          JSON.stringify({ error: "Waybill created but failed to save to order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, waybill_number: waybillNumber, status: "for_pickup" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "J&T API did not return waybill. Check logs. You can add waybill manually.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-jt-waybill error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
