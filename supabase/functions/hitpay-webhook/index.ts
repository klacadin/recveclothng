import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const HITPAY_SALT = Deno.env.get("HITPAY_SALT");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify HitPay webhook signature
function verifySignature(data: Record<string, string>, signature: string, salt: string): boolean {
  // Sort keys alphabetically and create string
  const sortedKeys = Object.keys(data).sort();
  const signatureString = sortedKeys
    .filter(key => key !== 'hmac')
    .map(key => `${key}${data[key]}`)
    .join('');
  
  // Create HMAC
  const encoder = new TextEncoder();
  const hmac = createHmac("sha256", encoder.encode(salt));
  hmac.update(encoder.encode(signatureString));
  const calculatedSignature = Array.from(new Uint8Array(hmac.digest()))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return calculatedSignature === signature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse form data (HitPay sends as form-urlencoded)
    const formData = await req.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log("Received HitPay webhook:", {
      payment_id: data.payment_id,
      reference_number: data.reference_number,
      status: data.status,
    });

    // Verify signature if salt is configured
    if (HITPAY_SALT && data.hmac) {
      const isValid = verifySignature(data, data.hmac, HITPAY_SALT);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const paymentId = data.payment_id;
    const paymentRequestId = data.payment_request_id;
    const referenceNumber = data.reference_number;
    const status = data.status;
    const paymentMethod = data.payment_type;

    // Map HitPay status to our status
    let paymentStatus = "pending";
    if (status === "completed") {
      paymentStatus = "completed";
    } else if (status === "failed" || status === "expired") {
      paymentStatus = "failed";
    } else if (status === "refunded") {
      paymentStatus = "refunded";
    }

    // Update payment transaction
    const { data: transaction, error: txError } = await supabase
      .from("payment_transactions")
      .update({
        status: paymentStatus,
        payment_reference: paymentId,
        payment_method: paymentMethod,
        metadata: data,
      })
      .eq("payment_id", paymentRequestId)
      .select("order_id")
      .single();

    if (txError) {
      console.error("Error updating payment transaction:", txError);
      // Try to find by reference number
      const { data: txByRef } = await supabase
        .from("payment_transactions")
        .update({
          status: paymentStatus,
          payment_reference: paymentId,
          payment_method: paymentMethod,
          metadata: data,
        })
        .eq("payment_id", referenceNumber)
        .select("order_id")
        .single();
      
      if (!txByRef) {
        console.error("Payment transaction not found");
      }
    }

    // Update order status if payment completed
    if (paymentStatus === "completed" && transaction?.order_id) {
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", transaction.order_id);

      if (orderError) {
        console.error("Error updating order status:", orderError);
      } else {
        console.log("Order marked as paid:", transaction.order_id);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in hitpay-webhook:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
