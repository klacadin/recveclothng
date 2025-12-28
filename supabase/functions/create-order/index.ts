import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  product_id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  notes: string | null;
  payment_method: 'cod' | 'gcash' | 'maya' | 'bank_transfer';
  subtotal: number;
  shipping_fee: number;
  total: number;
  items: OrderItem[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const orderData: OrderRequest = await req.json();
    console.log('Received order data:', JSON.stringify(orderData, null, 2));

    // Validate required fields
    if (!orderData.customer_name || !orderData.customer_email || !orderData.shipping_address) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.customer_email)) {
      console.error('Invalid email format');
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate items
    if (!orderData.items || orderData.items.length === 0) {
      console.error('No items in order');
      return new Response(
        JSON.stringify({ error: 'Order must contain at least one item' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate quantities and prices
    for (const item of orderData.items) {
      if (item.quantity <= 0) {
        console.error('Invalid quantity:', item);
        return new Response(
          JSON.stringify({ error: 'Item quantity must be positive' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (item.unit_price < 0 || item.total_price < 0) {
        console.error('Invalid price:', item);
        return new Response(
          JSON.stringify({ error: 'Prices cannot be negative' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Generate order number
    const now = new Date();
    const orderNumber = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    console.log('Generated order number:', orderNumber);

    // Check stock availability
    for (const item of orderData.items) {
      const { data: product, error: stockError } = await supabase
        .from('products')
        .select('stock_quantity, name')
        .eq('id', item.product_id)
        .single();

      if (stockError) {
        console.error('Error checking stock:', stockError);
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.product_name}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (product.stock_quantity < item.quantity) {
        console.error('Insufficient stock:', { product: product.name, available: product.stock_quantity, requested: item.quantity });
        return new Response(
          JSON.stringify({ error: `Insufficient stock for ${product.name}. Only ${product.stock_quantity} available.` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: orderData.customer_name.substring(0, 255),
        customer_email: orderData.customer_email.substring(0, 320),
        customer_phone: orderData.customer_phone?.substring(0, 50) || null,
        shipping_address: orderData.shipping_address.substring(0, 1000),
        notes: orderData.notes?.substring(0, 500) || null,
        payment_method: orderData.payment_method,
        subtotal: Math.max(0, orderData.subtotal),
        shipping_fee: Math.max(0, orderData.shipping_fee),
        total: Math.max(0, orderData.total),
        status: 'new',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: orderError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', order.id);

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name.substring(0, 255),
      product_sku: item.product_sku?.substring(0, 100) || null,
      quantity: Math.max(1, item.quantity),
      unit_price: Math.max(0, item.unit_price),
      total_price: Math.max(0, item.total_price),
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create order items', details: itemsError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order items created');

    // Update stock quantities
    for (const item of orderData.items) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: supabase.rpc('decrement_stock', { product_id: item.product_id, amount: item.quantity }) })
        .eq('id', item.product_id);
      
      // Simple stock decrement
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', item.product_id)
        .single();
      
      if (product) {
        await supabase
          .from('products')
          .update({ stock_quantity: product.stock_quantity - item.quantity })
          .eq('id', item.product_id);
      }
    }

    console.log('Stock quantities updated');

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id: order.id, 
        order_number: orderNumber 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
