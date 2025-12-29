import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-callback-token',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log('Xendit webhook received:', JSON.stringify(payload));

    // Xendit webhook event types for Payment Request API:
    // - payment.capture: Payment was successfully captured
    // - payment.authorization: Payment was authorized (cards)
    // - payment.failure: Payment failed
    const eventType = payload.event;
    const paymentData = payload.data || payload;

    console.log('Event type:', eventType);
    console.log('Payment status:', paymentData.status);

    // Handle payment success events
    if (
      eventType === 'payment.capture' ||
      paymentData.status === 'SUCCEEDED' ||
      paymentData.status === 'PAID'
    ) {
      // Get order ID from reference_id (we pass order_id as reference_id)
      const orderId = paymentData.reference_id || paymentData.metadata?.order_id;
      
      if (!orderId) {
        console.error('No order ID in webhook payload');
        return new Response(
          JSON.stringify({ error: 'Missing order reference' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Updating order to paid:', orderId);

      // Update order status to 'paid'
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update order:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update order status' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Order updated successfully:', order.order_number);

      // Send payment confirmation email
      try {
        const emailPayload = {
          type: 'payment_received',
          order_id: orderId,
          customer_email: order.customer_email,
          customer_name: order.customer_name,
          order_number: order.order_number,
          total: order.total,
          payment_method: order.payment_method,
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
        // Don't fail the webhook
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Order updated to paid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle payment failure
    if (
      eventType === 'payment.failure' ||
      paymentData.status === 'FAILED' ||
      paymentData.status === 'EXPIRED'
    ) {
      const orderId = paymentData.reference_id || paymentData.metadata?.order_id;
      
      if (orderId) {
        console.log('Payment failed for order:', orderId, 'Reason:', paymentData.failure_code);
        // We don't update order status to cancelled automatically
        // The order stays as 'new' and admin can decide what to do
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Payment failure acknowledged' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Acknowledge other events
    console.log('Unhandled event type:', eventType);
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook received' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
