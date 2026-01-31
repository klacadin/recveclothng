import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const generateOTP = (): string => {
  // Use cryptographically secure random number generation
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  // Generate 6-digit code (100000 to 999999)
  return (100000 + (array[0] % 900000)).toString();
};

const generateOTPEmail = (code: string, customerName: string): string => {
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
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verify Your Order</h1>
          </div>
          <div style="padding: 24px; text-align: center;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">Hi ${customerName},</p>
            <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">Please use the following code to confirm your order:</p>
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <p style="color: #111827; font-size: 36px; font-weight: 700; letter-spacing: 8px; margin: 0;">${code}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">This code expires in 10 minutes.</p>
            <p style="color: #6b7280; font-size: 14px; margin: 16px 0 0;">If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">REVE - Performance Apparel</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendEmailOTP = async (email: string, code: string, customerName: string): Promise<boolean> => {
  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "REVE <shop@reveclothingxnobody.com>",
      to: [email],
      subject: "Your Order Verification Code",
      html: generateOTPEmail(code, customerName),
    }),
  });

  const result = await emailResponse.json();
  
  if (!emailResponse.ok) {
    console.error("Resend API error:", result);
    return false;
  }
  
  console.log("Email OTP sent successfully to:", email);
  return true;
};

const sendSMSOTP = async (phone: string, code: string): Promise<boolean> => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error("Twilio credentials not configured");
    return false;
  }

  // Format phone number - ensure it starts with +
  let formattedPhone = phone.trim();
  if (!formattedPhone.startsWith("+")) {
    // Assume Philippine number if no country code
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+63" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("9")) {
      formattedPhone = "+63" + formattedPhone;
    } else {
      formattedPhone = "+" + formattedPhone;
    }
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const authHeader = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

  const body = new URLSearchParams({
    To: formattedPhone,
    From: TWILIO_PHONE_NUMBER,
    Body: `Your REVE order verification code is: ${code}. This code expires in 10 minutes.`,
  });

  const response = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Twilio API error:", result);
    return false;
  }

  console.log("SMS OTP sent successfully to:", formattedPhone);
  return true;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's token
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Verify the user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Invalid user token:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, phone, customer_name, method = "email" } = await req.json();
    
    if (!customer_name) {
      console.error("Missing customer name");
      return new Response(
        JSON.stringify({ error: "Missing customer name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate based on method
    if (method === "email") {
      if (!email) {
        console.error("Missing email");
        return new Response(
          JSON.stringify({ error: "Missing email" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error("Invalid email format");
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (method === "sms") {
      if (!phone) {
        console.error("Missing phone number");
        return new Response(
          JSON.stringify({ error: "Missing phone number" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Basic phone validation - at least 10 digits
      const digitsOnly = phone.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        console.error("Invalid phone number format");
        return new Response(
          JSON.stringify({ error: "Invalid phone number. Please enter at least 10 digits." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      console.error("Invalid method:", method);
      return new Response(
        JSON.stringify({ error: "Invalid verification method" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Per-recipient rate limiting - max 5 OTPs per email/phone per hour
    const recipient = method === "email" ? email : phone;
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    
    const { count, error: countError } = await supabase
      .from("checkout_otps")
      .select("*", { count: "exact", head: true })
      .eq("email", recipient)
      .gt("created_at", oneHourAgo);

    if (countError) {
      console.error("Error checking rate limit:", countError);
    } else if (count && count >= 5) {
      console.log(`Rate limit exceeded for recipient: ${recipient}`);
      return new Response(
        JSON.stringify({ error: "Too many verification codes sent. Please try again in an hour." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const { error: insertError } = await supabase
      .from("checkout_otps")
      .insert({
        user_id: user.id,
        email: method === "email" ? email : phone, // Store phone in email field for SMS
        code: otpCode,
        expires_at: expiresAt.toISOString(),
        verified: false,
      });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send OTP based on method
    let success = false;
    if (method === "email") {
      success = await sendEmailOTP(email, otpCode, customer_name);
    } else {
      success = await sendSMSOTP(phone, otpCode);
    }

    if (!success) {
      return new Response(
        JSON.stringify({ error: `Failed to send OTP via ${method}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const destination = method === "email" ? email : phone;
    console.log(`OTP sent successfully via ${method} to:`, destination);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: method === "email" 
          ? "OTP sent to your email" 
          : "OTP sent to your phone",
        method,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-otp:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
