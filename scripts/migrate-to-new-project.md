# Migration Execution Steps

## Step 1: Update Environment Variables

Your `.env` file exists. Update it with new project credentials:

1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/api
2. Copy the values and update your `.env` file:

```env
VITE_SUPABASE_URL=https://txiwvjfdlxgwjtaibbpb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<paste_anon_key_here>
```

## Step 2: Run Database Migrations

You have 17 migration files. Run them in order via Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new
2. Run each migration file in chronological order (oldest first)
3. Start with: `20251228213122_d7b1b660-3777-4c0c-b5ff-963862f04e0a.sql`
4. End with: `20260101140944_fae4e0fb-1690-46df-8982-ad8958a9eda5.sql`

## Step 3: Deploy Edge Functions

Deploy all 7 functions via Dashboard:

1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/functions
2. For each function, click "Deploy new function" and paste the code

Functions to deploy:
- send-otp
- verify-otp
- create-order
- create-xendit-payment
- xendit-webhook
- send-order-email
- notify-payment-proof

## Step 4: Configure Secrets

Add secrets at: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/functions

Required secrets:
- RESEND_API_KEY (for email OTP)

Optional secrets:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_PHONE_NUMBER
- XENDIT_SECRET_KEY
- XENDIT_WEBHOOK_TOKEN

