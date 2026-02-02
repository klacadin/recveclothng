import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for, x-real-ip',
};

type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';

interface OrderItem {
  product_id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  size: ProductSize; // Size is now required
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
  user_id?: string;
  voucher_code?: string | null;
}

// Test voucher: 99% off for low-cost payment testing
const TEST_VOUCHER = 'TEST99';
const TEST_VOUCHER_DISCOUNT = 0.99; // 99% off

interface ReservedItem {
  product_id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  size: ProductSize;
}

// Extract client IP from request headers
function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role to bypass RLS for order operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const orderData: OrderRequest = await req.json();
    const clientIP = getClientIP(req);
    console.log('Received order from IP:', clientIP);
    console.log('Received order data:', JSON.stringify({
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      items_count: orderData.items?.length,
      total: orderData.total
    }));

    // Validate required fields
    if (!orderData.customer_name || !orderData.customer_email || !orderData.shipping_address) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate customer name length
    if (orderData.customer_name.length > 255) {
      return new Response(
        JSON.stringify({ error: 'Customer name too long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.customer_email) || orderData.customer_email.length > 320) {
      console.error('Invalid email format');
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate shipping address
    if (orderData.shipping_address.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Shipping address too long' }),
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

    // Limit items per order to prevent abuse
    if (orderData.items.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Too many items in order (max 50)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate quantities and sizes
    const validSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
    for (const item of orderData.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 100) {
        console.error('Invalid quantity:', item);
        return new Response(
          JSON.stringify({ error: 'Item quantity must be between 1 and 100' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Validate product_id is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!item.product_id || !uuidRegex.test(item.product_id)) {
        return new Response(
          JSON.stringify({ error: 'Invalid product ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Validate size
      if (!item.size || !validSizes.includes(item.size)) {
        console.error('Invalid or missing size:', item);
        return new Response(
          JSON.stringify({ error: `Invalid size for ${item.product_name}. Size must be one of: XS, S, M, L, XL, 2XL, 3XL.` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // SECURITY: Check rate limits
    const { data: rateLimitResult, error: rateLimitError } = await supabase
      .rpc('check_order_rate_limit', {
        _ip_address: clientIP,
        _customer_email: orderData.customer_email,
        _max_orders_per_hour: 5
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      // Continue anyway - don't block orders if rate limit check fails
    } else if (rateLimitResult && rateLimitResult.length > 0 && !rateLimitResult[0].allowed) {
      console.warn('Rate limit exceeded:', { ip: clientIP, email: orderData.customer_email, count: rateLimitResult[0].orders_in_last_hour });
      return new Response(
        JSON.stringify({ error: 'Too many orders. Please wait before placing another order.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SECURITY: Check for duplicate orders
    const { data: duplicateResult, error: duplicateError } = await supabase
      .rpc('check_duplicate_order', {
        _customer_email: orderData.customer_email,
        _total: orderData.total,
        _minutes: 5
      });

    if (duplicateError) {
      console.error('Duplicate check error:', duplicateError);
      // Continue anyway
    } else if (duplicateResult === true) {
      console.warn('Duplicate order detected:', { email: orderData.customer_email, total: orderData.total });
      return new Response(
        JSON.stringify({ error: 'A similar order was recently placed. Please wait a few minutes before ordering again.' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate order number
    const now = new Date();
    const orderNumber = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    console.log('Generated order number:', orderNumber);

    // SECURITY: Reserve stock atomically using SIZE VARIANTS and validate prices from database
    const reservedItems: ReservedItem[] = [];
    let serverSubtotal = 0;

    for (const item of orderData.items) {
      // Use reserve_variant_stock for size-specific reservation
      const { data: stockResult, error: stockError } = await supabase
        .rpc('reserve_variant_stock', {
          _product_id: item.product_id,
          _size: item.size,
          _quantity: item.quantity
        });

      if (stockError) {
        console.error('Error reserving variant stock:', stockError);
        // Rollback previously reserved items
        for (const reserved of reservedItems) {
          await supabase.rpc('restore_variant_stock', {
            _product_id: reserved.product_id,
            _size: reserved.size,
            _quantity: reserved.quantity
          });
        }
        return new Response(
          JSON.stringify({ error: `Failed to process order: ${stockError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = stockResult?.[0];
      if (!result) {
        // Rollback previously reserved items
        for (const reserved of reservedItems) {
          await supabase.rpc('restore_variant_stock', {
            _product_id: reserved.product_id,
            _size: reserved.size,
            _quantity: reserved.quantity
          });
        }
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.product_name}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!result.is_active) {
        // Rollback previously reserved items
        for (const reserved of reservedItems) {
          await supabase.rpc('restore_variant_stock', {
            _product_id: reserved.product_id,
            _size: reserved.size,
            _quantity: reserved.quantity
          });
        }
        return new Response(
          JSON.stringify({ error: `Product is no longer available: ${result.product_name || item.product_name}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!result.success) {
        // Rollback previously reserved items
        for (const reserved of reservedItems) {
          await supabase.rpc('restore_variant_stock', {
            _product_id: reserved.product_id,
            _size: reserved.size,
            _quantity: reserved.quantity
          });
        }
        return new Response(
          JSON.stringify({ error: `Insufficient stock for ${result.product_name || item.product_name} (Size ${item.size}). Please reduce quantity or choose another size.` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // SECURITY: Use database price, not client-sent price
      const serverPrice = Number(result.product_price);
      const itemTotal = serverPrice * item.quantity;
      serverSubtotal += itemTotal;

      // Build SKU with variant suffix if available
      const fullSku = result.variant_sku_suffix 
        ? `${result.product_sku}-${result.variant_sku_suffix}`
        : result.product_sku;

      reservedItems.push({
        product_id: item.product_id,
        product_name: result.product_name || item.product_name,
        product_sku: fullSku || item.product_sku,
        quantity: item.quantity,
        unit_price: serverPrice,
        total_price: itemTotal,
        size: item.size,
      });

      console.log(`Reserved ${item.quantity} of ${result.product_name} (${item.size}) at ${serverPrice} each`);
    }

    // SECURITY: Calculate server-side total
    const shippingFee = Math.max(0, Math.min(orderData.shipping_fee, 10000)); // Cap shipping fee
    let serverTotal = serverSubtotal + shippingFee;

    // Apply test voucher (99% off) for low-cost payment testing
    const voucherCode = (orderData.voucher_code || '').trim().toUpperCase();
    if (voucherCode === TEST_VOUCHER) {
      const beforeDiscount = serverTotal;
      const discountAmount = Math.floor(beforeDiscount * TEST_VOUCHER_DISCOUNT);
      serverTotal = Math.max(1, beforeDiscount - discountAmount);
      console.log('TEST99 voucher applied:', { original: beforeDiscount, discount: discountAmount, final: serverTotal });
    }

    console.log('Server-calculated totals:', { subtotal: serverSubtotal, shipping: shippingFee, total: serverTotal });

    // Record rate limit entry
    await supabase
      .from('order_rate_limits')
      .insert({
        ip_address: clientIP,
        customer_email: orderData.customer_email,
      });

    // Create order with SERVER-CALCULATED values
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
        subtotal: serverSubtotal,
        shipping_fee: shippingFee,
        total: serverTotal,
        status: 'new',
        user_id: orderData.user_id || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      // Rollback reserved stock
      for (const reserved of reservedItems) {
        await supabase.rpc('restore_variant_stock', {
          _product_id: reserved.product_id,
          _size: reserved.size,
          _quantity: reserved.quantity
        });
      }
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', order.id);

    // Create order items with SERVER-VALIDATED values including size
    const orderItems = reservedItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name.substring(0, 255),
      product_sku: item.product_sku?.substring(0, 100) || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      size: item.size, // Include size in order items
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order and restore stock
      await supabase.from('orders').delete().eq('id', order.id);
      for (const reserved of reservedItems) {
        await supabase.rpc('restore_variant_stock', {
          _product_id: reserved.product_id,
          _size: reserved.size,
          _quantity: reserved.quantity
        });
      }
      return new Response(
        JSON.stringify({ error: 'Failed to create order items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order items created successfully');

    // Send confirmation email (non-blocking)
    try {
      const emailPayload = {
        type: 'confirmation',
        order_id: order.id,
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        order_number: orderNumber,
        items: reservedItems.map(item => ({
          ...item,
          size: item.size, // Include size in email
        })),
        subtotal: serverSubtotal,
        shipping_fee: shippingFee,
        total: serverTotal,
        payment_method: orderData.payment_method,
        shipping_address: orderData.shipping_address,
      };

      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify(emailPayload),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send confirmation email:', await emailResponse.text());
      } else {
        console.log('Confirmation email sent successfully');
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id: order.id, 
        order_number: orderNumber,
        total: serverTotal
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