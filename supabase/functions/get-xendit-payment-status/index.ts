import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetPaymentStatusRequest {
  payment_request_id: string;
  order_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const xenditSecretKey = Deno.env.get('XENDIT_SECRET_KEY');
    if (!xenditSecretKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'configuration_error',
          error: 'XENDIT_SECRET_KEY not configured',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let requestData: GetPaymentStatusRequest;
    try {
      requestData = await req.json();
    } catch (jsonError) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'invalid_request',
          error: 'Invalid request body',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { payment_request_id, order_id } = requestData;

    if (!payment_request_id) {
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'validation_error',
          error: 'payment_request_id is required',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch payment status from Xendit API
    const credentials = btoa(`${xenditSecretKey}:`);
    
    const xenditResponse = await fetch(`https://api.xendit.co/v3/payment_requests/${payment_request_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'api-version': '2024-11-11',
      },
    });

    const xenditResult = await xenditResponse.json();

    if (!xenditResponse.ok) {
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'xendit_api_error',
          error: xenditResult.message || 'Failed to fetch payment status',
          xendit_error: xenditResult,
          http_status: xenditResponse.status,
        }),
        { status: xenditResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Optionally update order status if order_id is provided and payment succeeded
    if (order_id && xenditResult.status === 'SUCCEEDED') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Check current order status - only update if not already paid
      const { data: order } = await supabase
        .from('orders')
        .select('status')
        .eq('id', order_id)
        .single();

      if (order && order.status !== 'paid') {
        await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            payment_reference_number: payment_request_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', order_id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: 'payment_status_fetched',
        payment_request_id: xenditResult.payment_request_id || payment_request_id,
        payment_status: xenditResult.status,
        reference_id: xenditResult.reference_id,
        request_amount: xenditResult.request_amount,
        currency: xenditResult.currency,
        channel_code: xenditResult.channel_code,
        failure_code: xenditResult.failure_code || null,
        created: xenditResult.created,
        updated: xenditResult.updated,
        latest_payment_id: xenditResult.latest_payment_id || null,
        actions: xenditResult.actions || [],
        metadata: xenditResult.metadata || {},
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
