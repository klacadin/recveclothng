import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Optional: require cron secret to prevent unauthorized calls
    const cronSecret = Deno.env.get('CRON_SECRET');
    if (cronSecret) {
      const provided = req.headers.get('x-cron-secret');
      if (provided !== cronSecret) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('status', 'pending_payment')
      .lt('created_at', twoHoursAgo)
      .select('id, order_number');

    if (error) {
      console.error('Failed to update stale orders:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const count = data?.length ?? 0;
    if (count > 0) {
      console.log(`Marked ${count} stale pending_payment orders as failed:`, data?.map((o: { order_number: string }) => o.order_number));
    }

    return new Response(
      JSON.stringify({
        success: true,
        updated_count: count,
        order_numbers: data?.map((o: { order_number: string }) => o.order_number) ?? [],
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('fail-stale-pending-orders error:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
