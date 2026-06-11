import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
};

const HITPAY_METHODS = ['gcash', 'maya', 'bank_transfer'];

type ReminderStage = 30 | 60 | 90;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const now = new Date();
    const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000).toISOString();
    const sixtyMinAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const ninetyMinAgo = new Date(now.getTime() - 90 * 60 * 1000).toISOString();

    const results: { stage: ReminderStage; order_number: string }[] = [];

    // Process 90 min first, then 60, then 30. Each stage targets orders in a specific age window
    // so we send only one reminder per order (the most recent due).
    const stages: { stage: ReminderStage; column: string; createdBefore: string; createdAtOrAfter?: string }[] = [
      { stage: 90, column: 'payment_reminder_90_at', createdBefore: ninetyMinAgo },
      { stage: 60, column: 'payment_reminder_60_at', createdBefore: sixtyMinAgo, createdAtOrAfter: ninetyMinAgo },
      { stage: 30, column: 'payment_reminder_30_at', createdBefore: thirtyMinAgo, createdAtOrAfter: sixtyMinAgo },
    ];

    for (const { stage, column, createdBefore, createdAtOrAfter } of stages) {
      let query = supabase
        .from('orders')
        .select('id, order_number, customer_email, customer_name, total, payment_method')
        .eq('status', 'pending_payment')
        .in('payment_method', HITPAY_METHODS)
        .lt('created_at', createdBefore)
        .is(column, null);

      if (createdAtOrAfter) {
        query = query.gte('created_at', createdAtOrAfter);
      }

      const { data: orders, error } = await query;

      if (error) {
        console.error(`Failed to fetch orders for ${stage}min reminder:`, error);
        continue;
      }

      for (const order of orders || []) {
        try {
          const emailPayload = {
            type: 'payment_reminder' as const,
            order_id: order.id,
            customer_email: order.customer_email,
            customer_name: order.customer_name,
            order_number: order.order_number,
            total: order.total,
            payment_method: order.payment_method,
            reminder_stage: stage,
            complete_payment_url: `${Deno.env.get('APP_URL') || 'https://reveclothingxnobody.com'}/my-orders`,
          };

          const emailRes = await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify(emailPayload),
          });

          if (emailRes.ok) {
            const updatePayload: Record<string, string> = { [column]: new Date().toISOString(), updated_at: new Date().toISOString() };
            await supabase.from('orders').update(updatePayload).eq('id', order.id);
            results.push({ stage, order_number: order.order_number });
            console.log(`Sent ${stage}min payment reminder for ${order.order_number}`);
          } else {
            console.error(`Failed to send ${stage}min reminder for ${order.order_number}:`, await emailRes.text());
          }
        } catch (err) {
          console.error(`Error sending ${stage}min reminder for ${order.order_number}:`, err);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        reminders_sent: results.length,
        details: results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('send-payment-reminders error:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
