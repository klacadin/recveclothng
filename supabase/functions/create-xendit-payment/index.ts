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
    const xenditSecretKey = Deno.env.get('XENDIT_SECRET_KEY');
    if (!xenditSecretKey) {
      console.error('XENDIT_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paymentData: PaymentRequest = await req.json();
    console.log('Creating Xendit payment for order:', paymentData.order_number);

    // Validate required fields
    if (!paymentData.order_id || !paymentData.amount || !paymentData.payment_method) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
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
        JSON.stringify({ error: 'Invalid payment method for online payment' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the app URL for redirects
    const appUrl = Deno.env.get('APP_URL') || 'https://lovable.dev';
    const successUrl = `${appUrl}/payment-success?order_id=${paymentData.order_id}`;
    const failureUrl = `${appUrl}/payment-failed?order_id=${paymentData.order_id}`;

    // Create Xendit Payment Request
    const xenditPayload = {
      reference_id: paymentData.order_id,
      amount: paymentData.amount,
      currency: 'PHP',
      country: 'PH',
      payment_method: {
        type: 'EWALLET',
        ewallet: {
          channel_code: channelCode,
          channel_properties: {
            success_return_url: successUrl,
            failure_return_url: failureUrl,
          },
        },
        reusability: 'ONE_TIME_USE',
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

    const xenditResponse = await fetch('https://api.xendit.co/payment_requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(xenditPayload),
    });

    const xenditResult = await xenditResponse.json();
    console.log('Xendit response:', JSON.stringify(xenditResult));

    if (!xenditResponse.ok) {
      console.error('Xendit API error:', xenditResult);
      return new Response(
        JSON.stringify({ 
          error: xenditResult.message || 'Failed to create payment',
          details: xenditResult,
        }),
        { status: xenditResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the redirect action
    const redirectAction = xenditResult.actions?.find(
      (action: { type: string; value: string }) => action.type === 'REDIRECT_CUSTOMER'
    );

    if (!redirectAction) {
      console.error('No redirect URL in Xendit response');
      return new Response(
        JSON.stringify({ error: 'Payment gateway did not return redirect URL' }),
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
        payment_id: xenditResult.id,
        redirect_url: redirectAction.value,
        status: xenditResult.status,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
