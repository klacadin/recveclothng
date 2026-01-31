# Supabase Project Migration Guide

## ✅ Completed

1. **Updated `supabase/config.toml`** - Project ID changed to `txiwvjfdlxgwjtaibbpb`

## 📋 Next Steps Required

### 1. Update Environment Variables

Update your `.env` file (or create one if it doesn't exist) with the new project credentials:

```env
VITE_SUPABASE_URL=https://txiwvjfdlxgwjtaibbpb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_new_anon_key_here
```

**Where to find these:**
1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/api
2. Copy the "Project URL" → `VITE_SUPABASE_URL`
3. Copy the "anon public" key → `VITE_SUPABASE_PUBLISHABLE_KEY`

### 2. Link Supabase Project (Optional - if using CLI)

If you have Supabase CLI installed:
```bash
supabase link --project-ref txiwvjfdlxgwjtaibbpb
```

If not installed, you can skip this step and manage everything through the dashboard.

### 3. Run Database Migrations

The new project needs all your database tables and schema. You have two options:

**Option A: Using Supabase Dashboard**
1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new
2. Run each migration file from `supabase/migrations/` in order
3. Start with the oldest migration first

**Option B: Using Supabase CLI** (if installed)
```bash
supabase db push
```

### 4. Deploy Edge Functions

All edge functions need to be deployed to the new project:

**Using Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/functions
2. For each function in `supabase/functions/`:
   - Click "Deploy new function"
   - Copy the code from the function file
   - Deploy

**Using Supabase CLI** (if installed):
```bash
supabase functions deploy send-otp
supabase functions deploy verify-otp
supabase functions deploy create-order
supabase functions deploy create-xendit-payment
supabase functions deploy xendit-webhook
supabase functions deploy send-order-email
supabase functions deploy notify-payment-proof
```

### 5. Configure Edge Function Secrets

Set up environment variables for edge functions:

1. Go to: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/functions
2. Add these secrets:
   - `RESEND_API_KEY` - Your Resend API key (for email OTP)
   - `TWILIO_ACCOUNT_SID` - Twilio Account SID (for SMS OTP, optional)
   - `TWILIO_AUTH_TOKEN` - Twilio Auth Token (for SMS OTP, optional)
   - `TWILIO_PHONE_NUMBER` - Twilio Phone Number (for SMS OTP, optional)
   - `XENDIT_SECRET_KEY` - Xendit Secret Key (for payments)
   - `XENDIT_WEBHOOK_TOKEN` - Xendit Webhook Token (for webhooks)

**Note:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available to edge functions.

### 6. Verify Connection

1. Update your `.env` file with new credentials
2. Restart your dev server: `npm run dev`
3. Test the connection by:
   - Logging in/out
   - Browsing products
   - Testing checkout flow

### 7. Test OTP Functionality

After setting up `RESEND_API_KEY`:
1. Go through checkout process
2. Request OTP code
3. Check your email for the code
4. Verify the code works

## 📝 Migration Checklist

- [x] Update `supabase/config.toml` with new project ID
- [ ] Update `.env` file with new `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Run database migrations on new project
- [ ] Deploy all edge functions to new project
- [ ] Configure edge function secrets (RESEND_API_KEY, etc.)
- [ ] Test authentication
- [ ] Test OTP functionality
- [ ] Test checkout flow
- [ ] Test admin panel

## 🔗 Useful Links

- **New Project Dashboard:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb
- **API Settings:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/settings/api
- **Edge Functions:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/functions
- **Database:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/editor
- **SQL Editor:** https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new

## ⚠️ Important Notes

1. **Data Migration:** Existing data from the old project will NOT automatically transfer. You'll need to:
   - Export data from old project (if needed)
   - Import to new project
   - Or start fresh with the new project

2. **Storage:** If you have files in Supabase Storage, you'll need to:
   - Export from old project
   - Upload to new project
   - Update any storage bucket policies

3. **Authentication:** User accounts from the old project won't transfer. Users will need to sign up again (or you can migrate auth data if needed).

4. **Environment Variables:** Make sure to update ALL environment variables that reference the old project.

## 🆘 Troubleshooting

**If OTP still doesn't work:**
- Check edge function logs in Supabase dashboard
- Verify `RESEND_API_KEY` is set correctly
- Check browser console for errors
- Verify user is authenticated before requesting OTP

**If connection fails:**
- Double-check `VITE_SUPABASE_URL` in `.env`
- Verify the project ID is correct
- Check that the project is active (not paused)

