# Migration Execution Summary

## ✅ Completed Automatically

1. **Updated `supabase/config.toml`** - Project ID changed to `txiwvjfdlxgwjtaibbpb`
2. **Created helper scripts** - Migration status checker and deployment helper

## 📋 Manual Steps Required

Since Supabase CLI is not installed and some operations require dashboard access, you'll need to complete these steps manually:

### Step 1: Update Environment Variables ⚠️ REQUIRED

**Action:** Update your `.env` file with new project credentials

1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/api
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Update your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://txiwvjfdlxgwjtaibbpb.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<paste_key_here>
   ```

### Step 2: Run Database Migrations ⚠️ REQUIRED

**Action:** Apply all 17 database migrations to the new project

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new
2. Open each migration file from `supabase/migrations/` in order:
   - Start with: `20251228213122_d7b1b660-3777-4c0c-b5ff-963862f04e0a.sql`
   - End with: `20260101140944_fae4e0fb-1690-46df-8982-ad8958a9eda5.sql`
3. Copy and paste each SQL file content into the SQL editor
4. Run each migration in chronological order

**Option B: Via Supabase CLI** (if you install it)
```bash
npm install -g supabase
supabase login
supabase link --project-ref txiwvjfdlxgwjtaibbpb
supabase db push
```

### Step 3: Deploy Edge Functions ⚠️ REQUIRED

**Action:** Deploy all 7 edge functions to the new project

1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/functions
2. For each function, click **"Deploy new function"**:
   - **Function name:** `send-otp` → Copy code from `supabase/functions/send-otp/index.ts`
   - **Function name:** `verify-otp` → Copy code from `supabase/functions/verify-otp/index.ts`
   - **Function name:** `create-order` → Copy code from `supabase/functions/create-order/index.ts`
   - **Function name:** `create-xendit-payment` → Copy code from `supabase/functions/create-xendit-payment/index.ts`
   - **Function name:** `xendit-webhook` → Copy code from `supabase/functions/xendit-webhook/index.ts`
   - **Function name:** `send-order-email` → Copy code from `supabase/functions/send-order-email/index.ts`
   - **Function name:** `notify-payment-proof` → Copy code from `supabase/functions/notify-payment-proof/index.ts`

### Step 4: Configure Edge Function Secrets ⚠️ REQUIRED FOR OTP

**Action:** Add environment variables for edge functions

1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/functions
2. Add these secrets:

   **Required:**
   - `RESEND_API_KEY` - Get from https://resend.com/api-keys (for email OTP)

   **Optional (for SMS OTP):**
   - `TWILIO_ACCOUNT_SID` - Twilio Account SID
   - `TWILIO_AUTH_TOKEN` - Twilio Auth Token
   - `TWILIO_PHONE_NUMBER` - Twilio Phone Number

   **Optional (for payments):**
   - `XENDIT_SECRET_KEY` - Xendit Secret Key
   - `XENDIT_WEBHOOK_TOKEN` - Xendit Webhook Token

   **Note:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available.

### Step 5: Verify Migration ✅

**Action:** Test the connection and functionality

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Test connection:**
   - Open the app in browser
   - Try logging in/out
   - Browse products
   - Check browser console for errors

3. **Test OTP (after setting RESEND_API_KEY):**
   - Go through checkout
   - Request OTP code
   - Check email for code
   - Verify code works

## 🔗 Quick Access Links

- **Project Dashboard:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb
- **API Settings:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/api
- **Edge Functions:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/functions
- **SQL Editor:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new
- **Function Secrets:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/functions

## 📊 Migration Checklist

- [x] Update `supabase/config.toml` with new project ID
- [ ] Update `.env` file with new `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Run all 17 database migrations
- [ ] Deploy all 7 edge functions
- [ ] Configure `RESEND_API_KEY` secret (required for OTP)
- [ ] Configure other optional secrets (Twilio, Xendit)
- [ ] Test authentication
- [ ] Test OTP functionality
- [ ] Test checkout flow

## ⚠️ Important Notes

1. **Data Migration:** Existing data from the old project won't transfer automatically. You'll start with an empty database.

2. **User Accounts:** Users will need to sign up again in the new project.

3. **Storage:** If you have files in Supabase Storage, you'll need to manually migrate them.

4. **Environment Variables:** Make sure to update your `.env` file before testing.

## 🆘 Troubleshooting

**If connection fails:**
- Verify `.env` file has correct `VITE_SUPABASE_URL`
- Check that project ID matches: `txiwvjfdlxgwjtaibbpb`
- Ensure project is active (not paused)

**If OTP doesn't work:**
- Verify `RESEND_API_KEY` is set in function secrets
- Check edge function logs in dashboard
- Verify user is authenticated before requesting OTP
- Check browser console for errors

**If migrations fail:**
- Run migrations one at a time
- Check for errors in SQL editor
- Verify you're running them in chronological order

