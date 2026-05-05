# Supabase Migration Validation Checklist

Use this after switching to project `txiwvjfdlxgwjtaibbpb`.

## 1) Environment and Template Checks

- [ ] `.env.example` exists with:
  - `VITE_SUPABASE_URL=https://txiwvjfdlxgwjtaibbpb.supabase.co`
  - `VITE_SUPABASE_PUBLISHABLE_KEY=...`
- [ ] `.env` exists and has the same `VITE_SUPABASE_URL`.
- [ ] `.env` has a real `VITE_SUPABASE_PUBLISHABLE_KEY` (not placeholder).
- [ ] `supabase/config.toml` includes `project_id = "txiwvjfdlxgwjtaibbpb"`.

Quick check command:

```powershell
.\scripts\check-migration-status.ps1
```

## 2) Database Migration Apply

- [ ] Link local CLI to target project:

```powershell
npx supabase link --project-ref txiwvjfdlxgwjtaibbpb
```

- [ ] Push schema migrations:

```powershell
npx supabase db push
```

- [ ] Confirm no migration errors in CLI output.

## 3) Edge Function Deploy

Required deploy list for this migration:

- `send-otp`
- `verify-otp`
- `create-order`
- `create-hitpay-payment`
- `hitpay-webhook`
- `get-hitpay-payment-status`
- `send-order-email`
- `notify-payment-proof`

Deploy command:

```powershell
.\scripts\deploy-functions.ps1
```

Optional:

- Deploy specific functions only: `.\scripts\deploy-functions.ps1 send-otp verify-otp`
- Deploy all functions in repo: `.\scripts\deploy-functions.ps1 --all`

## 4) Function Secrets Check

In Supabase dashboard (`Settings -> Edge Functions -> Secrets`):

- [ ] `RESEND_API_KEY` (required for email OTP)
- [ ] `HITPAY_API_KEY` (required for HitPay payments)
- [ ] `HITPAY_WEBHOOK_SALT` (required for HitPay webhook verification)
- [ ] `HITPAY_SANDBOX` (`true` only when using HitPay sandbox)
- [ ] `TWILIO_ACCOUNT_SID` (optional if SMS OTP is enabled)
- [ ] `TWILIO_AUTH_TOKEN` (optional if SMS OTP is enabled)
- [ ] `TWILIO_PHONE_NUMBER` (optional if SMS OTP is enabled)

## 5) Runtime Validation (App)

- [ ] Restart app:

```powershell
npm run dev
```

- [ ] Admin login works and does not return `exceed_cached_egress_quota`.
- [ ] Store product listing loads.
- [ ] Checkout creates order successfully.
- [ ] OTP send + verify works.
- [ ] Payment flow callback/webhook path works for your configured provider.

## 6) Post-Migration Safety Checks

- [ ] Supabase Auth users can sign up/sign in.
- [ ] RLS-protected reads/writes still function for normal users.
- [ ] Admin-only pages remain blocked for non-admin users.
- [ ] Storage uploads stay under 2MB and image compression still runs before upload.
