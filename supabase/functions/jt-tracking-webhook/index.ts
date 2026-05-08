/**
 * J&T Express Philippines - Tracking Webhook
 * 
 * Configure with AfterShip or TrackingMore to receive delivery status updates.
 * Set JNT_WEBHOOK_SECRET in Supabase secrets for signature verification.
 * 
 * AfterShip: https://www.aftership.com/carriers/jtexpress-ph
 * TrackingMore: https://www.trackingmore.com/jtexpress-ph-tracking-api.html
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const JNT_WEBHOOK_SECRET = Deno.env.get("JNT_WEBHOOK_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-jnt-webhook-secret, x-webhook-secret",
};

function unauthorized(message: string) {
  return new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 },
  );
}

function verifyWebhookSecret(req: Request): Response | null {
  if (!JNT_WEBHOOK_SECRET) {
    return new Response(
      JSON.stringify({ error: "J&T webhook verification is not configured" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }

  const suppliedSecret =
    req.headers.get("x-jnt-webhook-secret") ??
    req.headers.get("x-webhook-secret") ??
    "";

  if (suppliedSecret !== JNT_WEBHOOK_SECRET) {
    return unauthorized("Invalid webhook signature");
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const secretError = verifyWebhookSecret(req);
    if (secretError) return secretError;

    const body = await req.json();

    // TODO: Map tracking_number to order, update orders.tracking_number / status
    // TODO: Store tracking checkpoints in a tracking_events table

    console.log("J&T tracking webhook received:", JSON.stringify(body));

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Example: If body has tracking_number and status, update order
    const trackingNumber = body.tracking_number ?? body.trackingNumber;
    const status = body.tag ?? body.status;

    if (trackingNumber && status) {
      // Add order_tracking table and update logic when ready
      console.log(`Tracking ${trackingNumber}: ${status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("J&T webhook error:", e);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
