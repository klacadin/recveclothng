import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const HITPAY_API_KEY = Deno.env.get("HITPAY_API_KEY");
const HITPAY_SALT = Deno.env.get("HITPAY_SALT");
const HITPAY_API_URL = Deno.env.get("HITPAY_API_URL") || "https://api.hit-pay.com/v1"; // Use sandbox for testing
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") || "https://reveclothingxnobody.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  order_id: string;
  order_number: string;
  amount: number;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  payment_method?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!HITPAY_API_KEY) {
      console.error("HITPAY_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: PaymentRequest = await req.json();
    const { order_id, order_number, amount, customer_email, customer_name, customer_phone, items } = body;

    // Validate required fields
    if (!order_id || !amount || !customer_email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build item description
    const itemDescription = items.map(item => `${item.quantity}x ${item.name}`).join(", ");

    // Create HitPay payment request
    const hitpayPayload = {
      email: customer_email,
      name: customer_name,
      phone: customer_phone || "",
      amount: amount.toFixed(2),
      currency: "PHP",
      purpose: `REVE Order #${order_number}`,
      reference_number: order_number,
      redirect_url: `${SITE_URL}/order-confirmation?order_id=${order_id}&order_number=${order_number}`,
      webhook: `${SUPABASE_URL}/functions/v1/hitpay-webhook`,
      allow_repeated_payments: false,
      expiry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 24 hours
    };

    console.log("Creating HitPay payment request:", {
      order_number,
      amount,
      customer_email,
    });

    const hitpayResponse = await fetch(`${HITPAY_API_URL}/payment-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BUSINESS-API-KEY": HITPAY_API_KEY,
      },
      body: JSON.stringify(hitpayPayload),
    });

    const hitpayData = await hitpayResponse.json();

    if (!hitpayResponse.ok) {
      console.error("HitPay API error:", hitpayData);
      return new Response(
        JSON.stringify({ error: hitpayData.message || "Failed to create payment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("HitPay payment created:", hitpayData.id);

    // Store payment transaction
    const { error: insertError } = await supabase
      .from("payment_transactions")
      .insert({
        order_id,
        payment_id: hitpayData.id,
        amount,
        currency: "PHP",
        status: "pending",
        provider: "hitpay",
        metadata: {
          hitpay_url: hitpayData.url,
          reference: hitpayData.reference_number,
        },
      });

    if (insertError) {
      console.error("Error storing payment transaction:", insertError);
      // Don't fail the request, payment was created
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: hitpayData.id,
        redirect_url: hitpayData.url,
        reference: hitpayData.reference_number,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in create-hitpay-payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
