import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  proof_url: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);
    const data: NotificationRequest = await req.json();

    console.log("Sending payment proof notification for order:", data.order_number);

    // Initialize Supabase client to get admin emails
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get admin user emails
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
    }

    // Get admin emails from auth.users
    const adminEmails: string[] = [];
    if (adminRoles && adminRoles.length > 0) {
      const adminUserIds = adminRoles.map(r => r.user_id);
      
      for (const userId of adminUserIds) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
        if (!userError && userData?.user?.email) {
          adminEmails.push(userData.user.email);
        }
      }
    }

    // Fallback: if no admin emails found, log but don't fail
    if (adminEmails.length === 0) {
      console.log("No admin emails found, skipping email notification");
      return new Response(
        JSON.stringify({ success: true, message: "No admins to notify" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Proof Uploaded</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          .cta { background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💳 Payment Proof Uploaded</h1>
        </div>
        <div class="content">
          <p>A customer has uploaded proof of payment for their order:</p>
          
          <div class="order-details">
            <p><strong>Order Number:</strong> ${data.order_number}</p>
            <p><strong>Customer:</strong> ${data.customer_name}</p>
            <p><strong>Email:</strong> ${data.customer_email}</p>
            <p><strong>Total Amount:</strong> ₱${Number(data.total).toLocaleString()}</p>
          </div>
          
          <p>Please review the payment proof and update the order status accordingly.</p>
          
          <a href="${data.proof_url}" class="cta">View Payment Proof</a>
        </div>
        <div class="footer">
          <p>This is an automated notification from your store.</p>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "REVE <shop@reveclothingxnobody.com>",
      to: adminEmails,
      subject: `Payment Proof Uploaded - ${data.order_number}`,
      html: emailHtml,
    });

    console.log("Admin notification sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in notify-payment-proof function:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
