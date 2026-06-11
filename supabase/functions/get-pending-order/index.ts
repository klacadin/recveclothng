import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const order_number = (body.order_number || body.orderNumber || "").trim();
    const customer_email = (body.customer_email || body.customerEmail || "").trim().toLowerCase();

    if (!order_number || !customer_email) {
      return new Response(
        JSON.stringify({ error: "Order number and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Orders that can still upload proof: status 'new' or 'pending_payment' (if migration applied)
    let order: Record<string, unknown> | null = null;
    let err: { message: string } | null = null;

    const res = await supabase
      .from("orders")
      .select("id, order_number, status, total, customer_name, customer_email, proof_of_payment_url")
      .eq("order_number", order_number)
      .ilike("customer_email", customer_email)
      .in("status", ["new", "pending_payment"])
      .maybeSingle();

    if (res.error) {
      err = res.error;
      if (res.error.message?.includes("invalid input value for enum") || res.error.message?.includes("pending_payment")) {
        const fallback = await supabase
          .from("orders")
          .select("id, order_number, status, total, customer_name, customer_email, proof_of_payment_url")
          .eq("order_number", order_number)
          .ilike("customer_email", customer_email)
          .eq("status", "new")
          .maybeSingle();
        if (!fallback.error) {
          order = fallback.data;
          err = null;
        } else {
          err = fallback.error;
        }
      }
    } else {
      order = res.data;
    }

    if (err) {
      console.error("get-pending-order error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to look up order. Try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!order) {
      return new Response(
        JSON.stringify({ error: "Order not found or already processed. Check order number and email." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
