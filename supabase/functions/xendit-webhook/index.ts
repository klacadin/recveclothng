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
    // =====================================================
    // SECURITY: Verify Xendit webhook signature
    // =====================================================
    const webhookToken = Deno.env.get('XENDIT_WEBHOOK_TOKEN');
    const callbackToken = req.headers.get('x-callback-token');
    
    if (!webhookToken) {
      console.error('XENDIT_WEBHOOK_TOKEN not configured');
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'configuration_error',
          error: 'Webhook verification not configured',
          message: 'XENDIT_WEBHOOK_TOKEN is missing',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!callbackToken || callbackToken !== webhookToken) {
      console.error('Invalid webhook signature - request rejected');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Webhook signature verified successfully');
    // =====================================================

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log('Xendit webhook received:', JSON.stringify(payload));

    // Xendit webhook event types (v3 Payment Requests API):
    // payment_request.payment_created, payment_request.payment_succeeded, payment_request.payment_failed
    // Legacy: payment.capture, payment.authorization, payment.failure
    const eventType = payload.event || payload.type;
    const paymentData = payload.data || payload;

    console.log('Event type:', eventType);
    console.log('Payment status:', paymentData.status);
    console.log('Full payload:', JSON.stringify(payload));

    // Handle payment success events (v3 API and legacy)
    const isSuccess = 
      eventType === 'payment_request.payment_succeeded' ||
      eventType === 'payment.capture' ||
      eventType === 'payment_session.completed' ||
      paymentData.status === 'SUCCEEDED' ||
      paymentData.status === 'PAID' ||
      paymentData.status === 'COMPLETED' ||
      paymentData.status === 'SUCCESS';

    if (isSuccess) {
      // Get order ID from reference_id (we pass order_id as reference_id)
      const orderId = paymentData.reference_id || paymentData.metadata?.order_id || payload.reference_id;
      
      if (!orderId) {
        console.error('No order ID in webhook payload');
        return new Response(
          JSON.stringify({ 
            success: false,
            status: 'missing_order_reference',
            error: 'Missing order reference',
            payload_keys: Object.keys(payload),
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Updating order to paid:', orderId);

      // Get payment reference from Xendit (id or payment_request_id)
      const paymentRef = paymentData.id || paymentData.payment_request_id || paymentData.payment_id || null;

      // Update order status to 'paid' and save payment reference
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          payment_reference_number: paymentRef,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update order:', updateError);
        return new Response(
          JSON.stringify({ 
            success: false,
            status: 'database_error',
            error: 'Failed to update order status',
            order_id: orderId,
            database_error: updateError.message,
          }),
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
        JSON.stringify({ 
          success: true, 
          status: 'order_paid',
          message: 'Order updated to paid',
          order_id: orderId,
          order_number: order.order_number,
          payment_status: 'SUCCEEDED',
          event_type: eventType,
          updated_at: new Date().toISOString(),
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle payment failure (v3 API and legacy)
    const isFailure =
      eventType === 'payment_request.payment_failed' ||
      eventType === 'payment.failure' ||
      eventType === 'payment_session.expired' ||
      paymentData.status === 'FAILED' ||
      paymentData.status === 'EXPIRED';

    if (isFailure) {
      const orderId = paymentData.reference_id || paymentData.metadata?.order_id || payload.reference_id;
      
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
      JSON.stringify({ 
        success: true, 
        status: 'webhook_received',
        message: 'Webhook received',
        event_type: eventType,
        payment_status: paymentData.status || 'UNKNOWN',
        received_at: new Date().toISOString(),
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
