import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  order_id: string;
  order_number: string;
  amount: number;
  customer_email: string;
  customer_name: string;
  payment_method: 'gcash' | 'maya';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

// HitPay Philippines payment method codes
// gcash_qr = GCash; qrph_netbank = QR PH network (includes Maya, other e-wallets)
// Offer both for GCash/Maya so customer can choose at checkout
const PH_PAYMENT_METHODS = ['gcash_qr', 'qrph_netbank'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hitpayApiKey = Deno.env.get('HITPAY_API_KEY');
    if (!hitpayApiKey) {
      console.error('HITPAY_API_KEY not configured');
      return new Response(
        JSON.stringify({
          success: false,
          status: 'configuration_error',
          error: 'Payment service not configured',
          message: 'HITPAY_API_KEY is missing',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let paymentData: PaymentRequest;
    try {
      paymentData = await req.json();
    } catch (jsonError) {
      console.error('Failed to parse request body:', jsonError);
      return new Response(
        JSON.stringify({
          success: false,
          status: 'invalid_request',
          error: 'Invalid request body',
          message: 'Failed to parse JSON request body',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating HitPay payment for order:', paymentData.order_number);

    if (!paymentData.order_id || !paymentData.amount || !paymentData.payment_method) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'validation_error',
          error: 'Missing required fields',
          required_fields: ['order_id', 'amount', 'payment_method'],
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (paymentData.payment_method !== 'gcash' && paymentData.payment_method !== 'maya') {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'invalid_payment_method',
          error: 'Invalid payment method for online payment',
          received_method: paymentData.payment_method,
          supported_methods: ['gcash', 'maya'],
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const appUrl = Deno.env.get('APP_URL') || Deno.env.get('BASE_URL') || 'https://reveclothingxnobody.com';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const webhookUrl = `${supabaseUrl}/functions/v1/hitpay-webhook`;
    const redirectUrl = `${appUrl}/payment-success?order_id=${paymentData.order_id}`;

    const hitpayBaseUrl = Deno.env.get('HITPAY_SANDBOX') === 'true'
      ? 'https://api.sandbox.hit-pay.com'
      : 'https://api.hit-pay.com';

    const hitpayPayload = {
      amount: paymentData.amount,
      currency: 'PHP',
      payment_methods: PH_PAYMENT_METHODS,
      email: paymentData.customer_email,
      name: paymentData.customer_name,
      purpose: `Order ${paymentData.order_number}`,
      reference_number: paymentData.order_id,
      redirect_url: redirectUrl,
      webhook: webhookUrl,
      send_email: 'false',
      send_sms: 'false',
    };

    console.log('HitPay request payload:', JSON.stringify(hitpayPayload));

    const hitpayResponse = await fetch(`${hitpayBaseUrl}/v1/payment-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BUSINESS-API-KEY': hitpayApiKey,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(hitpayPayload),
    });

    const hitpayResult = await hitpayResponse.json();
    console.log('HitPay response:', JSON.stringify(hitpayResult));

    if (!hitpayResponse.ok) {
      console.error('HitPay API error:', hitpayResult);
      return new Response(
        JSON.stringify({
          success: false,
          status: 'hitpay_api_error',
          error: hitpayResult.message || 'Failed to create payment',
          hitpay_error: hitpayResult,
          http_status: hitpayResponse.status,
        }),
        { status: hitpayResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const checkoutUrl = hitpayResult.url;
    const paymentRequestId = hitpayResult.id;

    if (!checkoutUrl || !paymentRequestId) {
      console.error('No checkout URL or ID in HitPay response:', hitpayResult);
      return new Response(
        JSON.stringify({
          success: false,
          status: 'missing_redirect_url',
          error: 'Payment gateway did not return checkout URL',
          hitpay_response: hitpayResult,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        xendit_payment_id: paymentRequestId, // Column reused for payment gateway ID
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentData.order_id);

    if (updateError) {
      console.error('Failed to update order with payment ID:', updateError);
      // Don't fail - payment was created
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: 'payment_created',
        payment_id: paymentRequestId,
        redirect_url: checkoutUrl,
        payment_status: hitpayResult.status,
        order_id: paymentData.order_id,
        order_number: paymentData.order_number,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        created_at: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Unexpected error:', error);
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
