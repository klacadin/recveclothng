import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

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
    const fileBase64 = body.file_base64;
    const fileName = body.file_name || "proof.jpg";

    if (!order_number || !customer_email || !fileBase64) {
      return new Response(
        JSON.stringify({ error: "Order number, email, and file are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, order_number, status, total, customer_name, customer_email")
      .eq("order_number", order_number)
      .ilike("customer_email", customer_email)
      .in("status", ["new", "pending_payment"])
      .maybeSingle();

    if (fetchError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found or not awaiting payment proof" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const binary = Uint8Array.from(atob(fileBase64), (c) => c.charCodeAt(0));
    if (binary.length > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: "File too large (max 10MB)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `guest/${order.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(safeName, binary, { upsert: true, contentType: ALLOWED_TYPES[0] });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload file" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(safeName);
    const proofUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        proof_of_payment_url: proofUrl,
        proof_uploaded_at: new Date().toISOString(),
        status: "for_verification",
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Order update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to save proof" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      await fetch(`${supabaseUrl}/functions/v1/notify-payment-proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({
          order_id: order.id,
          order_number: order.order_number,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          total: order.total,
          proof_url: proofUrl,
        }),
      });
    } catch (_) {}

    return new Response(
      JSON.stringify({ success: true, proof_url: proofUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
