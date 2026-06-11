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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hitpayApiKey = Deno.env.get('HITPAY_API_KEY');
    if (!hitpayApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'configuration_error',
          error: 'HITPAY_API_KEY not configured',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let requestData: GetPaymentStatusRequest;
    try {
      requestData = await req.json();
    } catch {
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

    const hitpayBaseUrl = Deno.env.get('HITPAY_SANDBOX') === 'true'
      ? 'https://api.sandbox.hit-pay.com'
      : 'https://api.hit-pay.com';

    const hitpayResponse = await fetch(
      `${hitpayBaseUrl}/v1/payment-requests/${payment_request_id}`,
      {
        method: 'GET',
        headers: {
          'X-BUSINESS-API-KEY': hitpayApiKey,
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    );

    const hitpayResult = await hitpayResponse.json();

    if (!hitpayResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'hitpay_api_error',
          error: hitpayResult.message || 'Failed to fetch payment status',
          hitpay_error: hitpayResult,
          http_status: hitpayResponse.status,
        }),
        { status: hitpayResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const status = hitpayResult.status; // pending, completed, failed, expired, canceled, inactive

    if (order_id && (status === 'completed' || status === 'succeeded')) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
        payment_request_id: hitpayResult.id || payment_request_id,
        payment_status: hitpayResult.status,
        reference_number: hitpayResult.reference_number,
        amount: hitpayResult.amount,
        currency: hitpayResult.currency,
        payments: hitpayResult.payments || [],
        created_at: hitpayResult.created_at,
        updated_at: hitpayResult.updated_at,
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
