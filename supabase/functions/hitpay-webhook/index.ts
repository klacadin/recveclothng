import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, hitpay-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSalt = Deno.env.get('HITPAY_WEBHOOK_SALT');
    if (!webhookSalt) {
      console.error('HITPAY_WEBHOOK_SALT not configured');
      return new Response(
        JSON.stringify({
          success: false,
          status: 'configuration_error',
          error: 'Webhook verification not configured',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const signature = req.headers.get('hitpay-signature');
    const rawBody = await req.text();

    if (!signature || !rawBody) {
      console.error('Missing webhook signature or body');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook request' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate HMAC-SHA256 signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSalt),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    const computedSignature = Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (computedSignature !== signature) {
      console.error('Invalid HitPay webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('HitPay webhook signature verified');

    const payload = JSON.parse(rawBody);
    console.log('HitPay webhook received:', JSON.stringify(payload));

    const status = payload.status;
    const orderId = payload.reference_number || payload.reference_id;
    const paymentRequestId = payload.id;

    // HitPay: status 'completed' = payment succeeded
    const isSuccess = status === 'completed' || status === 'succeeded';

    if (!isSuccess) {
      console.log('HitPay webhook: payment not completed, status:', status);
      return new Response(
        JSON.stringify({ success: true, message: 'Webhook received' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!orderId) {
      console.error('No order reference in HitPay webhook payload');
      return new Response(
        JSON.stringify({
          success: false,
          status: 'missing_order_reference',
          error: 'Missing order reference',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const paymentRef = payload.payments?.[0]?.id || paymentRequestId;

    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_reference_number: paymentRef,
        xendit_payment_id: paymentRequestId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select('id, order_number, customer_email, customer_name, total, payment_method')
      .single();

    if (updateError) {
      console.error('Failed to update order:', updateError);
      return new Response(
        JSON.stringify({
          success: false,
          status: 'database_error',
          error: 'Failed to update order status',
          order_id: orderId,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order updated to paid:', order.order_number);

    try {
      const emailPayload = {
        type: 'status_update',
        order_id: orderId,
        customer_email: order.customer_email,
        customer_name: order.customer_name,
        order_number: order.order_number,
        total: order.total,
        payment_method: order.payment_method,
        new_status: 'paid',
      };

      await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify(emailPayload),
      });
      console.log('Payment confirmation email sent');
    } catch (emailError) {
      console.error('Failed to send payment email:', emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: 'order_paid',
        message: 'Order updated to paid',
        order_id: orderId,
        order_number: order.order_number,
        payment_status: 'completed',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        status: 'internal_server_error',
        error: 'Internal server error',
        message: errorMessage,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
