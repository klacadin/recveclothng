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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log request details for debugging
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    const xenditSecretKey = Deno.env.get('XENDIT_SECRET_KEY');
    if (!xenditSecretKey) {
      console.error('XENDIT_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'configuration_error',
          error: 'Payment service not configured',
          message: 'XENDIT_SECRET_KEY is missing',
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
    
    console.log('Creating Xendit payment for order:', paymentData.order_number);
    console.log('Payment data:', JSON.stringify({
      order_id: paymentData.order_id,
      order_number: paymentData.order_number,
      amount: paymentData.amount,
      payment_method: paymentData.payment_method,
    }));

    // Validate required fields
    if (!paymentData.order_id || !paymentData.amount || !paymentData.payment_method) {
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'validation_error',
          error: 'Missing required fields',
          required_fields: ['order_id', 'amount', 'payment_method'],
          received: {
            order_id: !!paymentData.order_id,
            amount: !!paymentData.amount,
            payment_method: !!paymentData.payment_method,
          },
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map payment method to Xendit channel code
    const channelCodeMap: Record<string, string> = {
      'gcash': 'GCASH',
      'maya': 'PAYMAYA',
    };

    const channelCode = channelCodeMap[paymentData.payment_method];
    if (!channelCode) {
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'invalid_payment_method',
          error: 'Invalid payment method for online payment',
          received_method: paymentData.payment_method,
          supported_methods: Object.keys(channelCodeMap),
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the app URL for redirects
    const appUrl = Deno.env.get('APP_URL') || Deno.env.get('BASE_URL') || 'https://reveclothingxnobody.com';
    const successUrl = `${appUrl}/payment-success?order_id=${paymentData.order_id}`;
    const failureUrl = `${appUrl}/payment-failed?order_id=${paymentData.order_id}`;

    // Create Xendit Payment Request (v3 API)
    const xenditPayload = {
      reference_id: paymentData.order_id,
      type: 'PAY',
      country: 'PH',
      currency: 'PHP',
      request_amount: paymentData.amount,
      capture_method: 'AUTOMATIC',
      channel_code: channelCode,
      channel_properties: {
        success_return_url: successUrl,
        failure_return_url: failureUrl,
      },
      description: `Order ${paymentData.order_number}`,
      metadata: {
        order_id: paymentData.order_id,
        order_number: paymentData.order_number,
        customer_email: paymentData.customer_email,
        customer_name: paymentData.customer_name,
      },
    };

    console.log('Xendit request payload:', JSON.stringify(xenditPayload));

    // Encode credentials for Basic Auth
    const credentials = btoa(`${xenditSecretKey}:`);

    const xenditResponse = await fetch('https://api.xendit.co/v3/payment_requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'api-version': '2024-11-11', // Required by Xendit API v3
      },
      body: JSON.stringify(xenditPayload),
    });

    const xenditResult = await xenditResponse.json();
    console.log('Xendit response:', JSON.stringify(xenditResult));

    if (!xenditResponse.ok) {
      console.error('Xendit API error:', xenditResult);
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'xendit_api_error',
          error: xenditResult.message || 'Failed to create payment',
          xendit_error: xenditResult,
          http_status: xenditResponse.status,
        }),
        { status: xenditResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the redirect action (v3 API uses actions array with type/value)
    const redirectAction = xenditResult.actions?.find(
      (action: { type: string; value: string }) => action.type === 'REDIRECT_CUSTOMER' || action.type === 'REDIRECT'
    );

    if (!redirectAction) {
      console.error('No redirect URL in Xendit response. Response:', JSON.stringify(xenditResult));
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'missing_redirect_url',
          error: 'Payment gateway did not return redirect URL',
          xendit_response: xenditResult,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store payment request ID in order for reference
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update order with payment reference (store in notes for now)
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        notes: `Xendit Payment ID: ${xenditResult.id}`
      })
      .eq('id', paymentData.order_id);

    if (updateError) {
      console.error('Failed to update order with payment ID:', updateError);
      // Don't fail the payment, just log
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: 'payment_created',
        payment_id: xenditResult.id || xenditResult.payment_request_id,
        redirect_url: redirectAction.value,
        payment_status: xenditResult.status,
        order_id: paymentData.order_id,
        order_number: paymentData.order_number,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        channel_code: channelCode,
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
