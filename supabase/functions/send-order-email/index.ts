import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  size?: string | null;
}

interface EmailRequest {
  type: 'confirmation' | 'status_update' | 'proof_reminder' | 'payment_reminder';
  order_id: string;
  customer_email: string;
  customer_name: string;
  order_number: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping_fee?: number;
  total?: number;
  new_status?: string;
  payment_method?: string;
  shipping_address?: string;
  upload_proof_url?: string;
  reminder_stage?: 30 | 60 | 90;
  complete_payment_url?: string;
}

const formatPrice = (price: number): string => {
  return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'new': 'Order Placed',
    'paid': 'Payment Confirmed',
    'packed': 'Order Packed',
    'shipped': 'Order Shipped',
    'completed': 'Order Completed',
    'cancelled': 'Order Cancelled'
  };
  return labels[status] || status;
};

const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    'cod': 'J&T Cash on Delivery',
    'gcash': 'GCash',
    'maya': 'Maya',
    'bank_transfer': 'Bank Transfer'
  };
  return labels[method] || method;
};

const generateConfirmationEmail = (data: EmailRequest): string => {
  const itemsHtml = data.items?.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.product_name}
        ${item.size ? `<span style="display: inline-block; background-color: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; margin-left: 8px;">Size: ${item.size}</span>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.unit_price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.total_price)}</td>
    </tr>
  `).join('') || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="background-color: #1a1a1a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmed!</h1>
          </div>
          <div style="padding: 24px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 16px;">Hi ${data.customer_name},</p>
            <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">Thank you for your order! We've received your order and will begin processing it shortly.</p>
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Order Number</p>
              <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0;">${data.order_number}</p>
            </div>
            <h2 style="color: #111827; font-size: 18px; margin: 0 0 16px;">Order Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background-color: #f9fafb;">
                  <th style="padding: 12px; text-align: left; font-size: 14px; color: #6b7280;">Product</th>
                  <th style="padding: 12px; text-align: center; font-size: 14px; color: #6b7280;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280;">Price</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div style="border-top: 2px solid #e5e7eb; padding-top: 16px;">
              <table style="width: 100%;">
                <tr><td style="color: #6b7280; padding: 4px 0;">Subtotal</td><td style="color: #374151; text-align: right;">${formatPrice(data.subtotal || 0)}</td></tr>
                <tr><td style="color: #6b7280; padding: 4px 0;">Shipping</td><td style="color: #374151; text-align: right;">${formatPrice(data.shipping_fee || 0)}</td></tr>
                <tr><td style="color: #111827; font-weight: 600; font-size: 18px; padding-top: 12px; border-top: 1px solid #e5e7eb;">Total</td><td style="color: #111827; font-weight: 600; font-size: 18px; text-align: right; padding-top: 12px; border-top: 1px solid #e5e7eb;">${formatPrice(data.total || 0)}</td></tr>
              </table>
            </div>
            <div style="margin-top: 24px; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
              <h3 style="color: #111827; font-size: 16px; margin: 0 0 12px;">Shipping Address</h3>
              <p style="color: #374151; font-size: 14px; margin: 0 0 16px; white-space: pre-line;">${data.shipping_address || ''}</p>
              <h3 style="color: #111827; font-size: 16px; margin: 0 0 8px;">Payment Method</h3>
              <p style="color: #374151; font-size: 14px; margin: 0;">${getPaymentMethodLabel(data.payment_method || 'cod')}</p>
            </div>
          </div>
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">If you have any questions, please contact us.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateStatusUpdateEmail = (data: EmailRequest): string => {
  const statusLabel = getStatusLabel(data.new_status || '');
  const statusColor = data.new_status === 'cancelled' ? '#ef4444' : '#10b981';

  let statusMessage = '';
  switch (data.new_status) {
    case 'paid':
      statusMessage = 'Your payment has been confirmed. We will start packing your order shortly.';
      break;
    case 'packed':
      statusMessage = 'Your order has been packed and is ready for shipping.';
      break;
    case 'shipped':
      statusMessage = 'Great news! Your order is on its way to you.';
      break;
    case 'completed':
      statusMessage = 'Your order has been delivered. Thank you for shopping with us!';
      break;
    case 'cancelled':
      statusMessage = 'Your order has been cancelled. If you did not request this, please contact us.';
      break;
    default:
      statusMessage = 'Your order status has been updated.';
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="background-color: #1a1a1a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Update</h1>
          </div>
          <div style="padding: 24px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 16px;">Hi ${data.customer_name},</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="display: inline-block; background-color: ${statusColor}; color: #ffffff; padding: 12px 24px; border-radius: 24px; font-size: 16px; font-weight: 600;">${statusLabel}</span>
            </div>
            <p style="color: #374151; font-size: 16px; text-align: center; margin: 0 0 24px;">${statusMessage}</p>
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Order Number</p>
              <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0;">${data.order_number}</p>
            </div>
          </div>
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">If you have any questions, please contact us.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateProofReminderEmail = (data: EmailRequest): string => {
  const appUrl = Deno.env.get('APP_URL') || Deno.env.get('BASE_URL') || 'https://reveclothingxnobody.com';
  const uploadUrl = data.upload_proof_url || `${appUrl}/upload-proof?order=${encodeURIComponent(data.order_number)}`;
  const paymentMethodLabel = getPaymentMethodLabel(data.payment_method || 'bank_transfer');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="background-color: #f59e0b; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Payment Proof Required</h1>
          </div>
          <div style="padding: 24px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 16px;">Hi ${data.customer_name},</p>
            <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">We noticed that your order is still pending payment verification. To complete your order, please upload proof of payment.</p>
            
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Order Number</p>
              <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px;">${data.order_number}</p>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 16px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Payment Method</p>
                <p style="color: #111827; font-size: 16px; font-weight: 500; margin: 0 0 16px;">${paymentMethodLabel}</p>
                
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Total Amount</p>
                <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0;">${formatPrice(data.total || 0)}</p>
              </div>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${uploadUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">Upload Proof of Payment</a>
            </div>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #92400e; font-size: 14px; margin: 0 0 8px; font-weight: 600;">📸 What to upload:</p>
              <ul style="color: #92400e; font-size: 14px; margin: 0; padding-left: 20px;">
                <li>Screenshot of your ${paymentMethodLabel} payment confirmation</li>
                <li>Bank transfer receipt</li>
                <li>Any proof showing the transaction amount and reference number</li>
              </ul>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0; text-align: center;">If you've already paid, please upload your proof of payment so we can process your order.</p>
          </div>
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">If you have any questions, please contact us at shop@reveclothingxnobody.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generatePaymentReminderEmail = (data: EmailRequest): string => {
  const appUrl = Deno.env.get('APP_URL') || Deno.env.get('BASE_URL') || 'https://reveclothingxnobody.com';
  const paymentUrl = data.complete_payment_url || `${appUrl}/my-orders`;
  const paymentMethodLabel = getPaymentMethodLabel(data.payment_method || 'gcash');
  const isFinal = data.reminder_stage === 90;

  const stageMessage = isFinal
    ? 'This is our final reminder—we\'d hate for your order to slip away.'
    : 'We\'re holding your order—just one step left to lock it in.';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="background-color: #1a1a1a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your Order Is Reserved for You</h1>
            <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 8px 0 0;">REVE Clothing — Timing is Everything</p>
          </div>
          <div style="padding: 24px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 16px;">Hi ${data.customer_name},</p>
            <p style="color: #374151; font-size: 16px; margin: 0 0 16px; line-height: 1.6;">We wanted to reach out—your REVE order is reserved for you! ${stageMessage}</p>
            <p style="color: #374151; font-size: 16px; margin: 0 0 24px; line-height: 1.6;">Complete your ${paymentMethodLabel} payment to confirm your order, and we'll get your gear on its way.</p>
            
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Order Number</p>
              <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 12px;">${data.order_number}</p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">Total — ${formatPrice(data.total || 0)}</p>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${paymentUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">Complete Payment</a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0; line-height: 1.5; text-align: center;">From Nobody to Somebody—we're here for your journey. Questions? Reply anytime at shop@reveclothingxnobody.com</p>
          </div>
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">REVE Clothing · Performance apparel born in Bukidnon</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailRequest = await req.json();
    console.log('Received email request:', JSON.stringify(data, null, 2));

    if (!data.customer_email || !data.customer_name || !data.order_number) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customer_email)) {
      console.error('Invalid email format');
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let subject: string;
    let html: string;

    if (data.type === 'confirmation') {
      subject = `Order Confirmed - ${data.order_number}`;
      html = generateConfirmationEmail(data);
    } else if (data.type === 'status_update') {
      const statusLabel = getStatusLabel(data.new_status || '');
      subject = `Order ${statusLabel} - ${data.order_number}`;
      html = generateStatusUpdateEmail(data);
    } else if (data.type === 'proof_reminder') {
      subject = `Payment Proof Required - ${data.order_number}`;
      html = generateProofReminderEmail(data);
    } else if (data.type === 'payment_reminder') {
      const isFinal = data.reminder_stage === 90;
      subject = isFinal
        ? `Last chance: Your order is still reserved for you — ${data.order_number}`
        : `Your order is reserved for you — Complete payment · ${data.order_number}`;
      html = generatePaymentReminderEmail(data);
    } else {
      console.error('Invalid email type');
      return new Response(
        JSON.stringify({ error: 'Invalid email type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'REVE <shop@reveclothingxnobody.com>',
        to: [data.customer_email],
        subject: subject,
        html: html,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend API error:', result);
      return new Response(
        JSON.stringify({ error: result.message || 'Failed to send email' }),
        { status: emailResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
