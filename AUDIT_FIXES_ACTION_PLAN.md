# AUDIT FIXES - Action Plan for REVE Clothing
**Date:** May 7, 2026  
**Based on:** FULL_AUDIT_2026_MAY.md  
**Status:** Ready to implement

---

## 🚨 CRITICAL - Must Fix This Week

### Fix #1: Security Vulnerabilities (npm audit fix)
**Priority:** 🔴 CRITICAL  
**Time:** 5-10 minutes  
**Impact:** Blocks production deployment

```bash
# Step 1: Check current vulnerabilities
cd z:\DEV\01_CORE_STARTUPS\MSMEs\recveclothng
npm audit

# Expected: 15 vulnerabilities (4 moderate, 10 high, 1 critical)

# Step 2: Auto-fix most issues
npm audit fix

# Step 3: Check what remains
npm audit

# Expected after fix: Only xlsx remains (no fix available)
# xlsx has known vulnerabilities but may be acceptable if not user-supplied
```

**What This Fixes:**
- ✅ vite (path traversal, file read vulnerabilities)
- ✅ serialize-javascript (RCE, DoS)
- ✅ minimatch, picomatch, rollup (ReDoS, file write)
- ✅ ajv, brace-expansion, postcss, yaml
- ⚠️ xlsx - No automated fix available (see section 3)

**Potential Issues:**
- May bump minor/major versions
- Test build after: `npm run build` should still complete
- Commit results if successful

---

### Fix #2: Update Twilio Phone Number (Blocks SMS OTP)
**Priority:** 🔴 CRITICAL  
**Time:** 5 minutes  
**Impact:** SMS OTP won't work without this

**Current Status:** Set to placeholder `+1234567890`

```bash
# Option A: Using CLI (if you have Supabase CLI installed)
npx supabase secrets set TWILIO_PHONE_NUMBER=+639XXXXXXXXX
# Replace with actual Twilio phone number

# Option B: Using Supabase Dashboard
# 1. Go to: https://supabase.com/dashboard/project/unaodlytdymouicuuywb
# 2. Navigate to: Settings → Edge Functions → Secrets
# 3. Find: TWILIO_PHONE_NUMBER
# 4. Update value to actual number
# 5. Save
```

**Format:** Must be international format starting with `+`  
**Example:** `+639XXXXXXXXX` for Philippines

---

### Fix #3: TypeScript Type Safety (31 errors)
**Priority:** 🔴 HIGH  
**Time:** 2-3 hours  
**Impact:** Better IDE support, fewer runtime bugs

These are the main files with `any` type violations:

**File 1: src/pages/Admin.tsx (8 errors)**
```typescript
// Current (lines shown as examples):
const handleAddArticle = (e: any) => {

// Should be:
const handleAddArticle = (e: React.FormEvent<HTMLFormElement>) => {
```

**Pattern 1 - Form Events:**
```typescript
// Current:
const handleChange = (e: any) => {

// Fixed:
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
```

**Pattern 2 - Click Events:**
```typescript
// Current:
const handleClick = (e: any) => {

// Fixed:
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
```

**File 2: src/components/admin/ProductForm.tsx (4 errors)**
- Same patterns as above

**File 3: Remaining files (1-2 errors each)**
- Same patterns, just need systematic replacement

**Fix Process:**
```bash
# 1. Start with Admin.tsx
# 2. Replace patterns one by one
# 3. Test each file as you go

# Run lint to see progress
npm run lint 2>&1 | grep "Unexpected any"
# Should decrease from 31 to 0
```

---

## ⚠️ HIGH PRIORITY - Fix This Month

### Fix #4: React Hook Dependencies (3 useEffect warnings)
**Priority:** ⚠️ HIGH  
**Time:** 1 hour  
**Impact:** Prevents stale closures and bugs

**Location 1: src/components/admin/CustomerInfoDialog.tsx:72**
```typescript
// Current:
useEffect(() => {
  // ... code using 'order'
}, []); // ❌ Missing 'order' dependency

// Fixed:
useEffect(() => {
  // ... code using 'order'
}, [order]); // ✅ Added missing dependency
```

**Location 2: src/components/checkout/OTPVerification.tsx:149**
```typescript
// Current:
useEffect(() => {
  // ... code using 'otpSent' and 'sendOTP'
}, []); // ❌ Missing dependencies

// Fixed:
useEffect(() => {
  // ... code
}, [otpSent, sendOTP]); // ✅ Added missing dependencies
```

**Location 3: src/pages/Checkout.tsx:154**
```typescript
// Current:
useEffect(() => {
  // ... code using 'formData.customerEmail'
}, []); // ❌ Missing dependency

// Fixed:
useEffect(() => {
  // ... code
}, [formData.customerEmail]); // ✅ Added missing dependency
```

---

### Fix #5: Basic FTP Removal (If Deployed to cPanel)
**Priority:** ⚠️ MEDIUM  
**Time:** 1-2 hours  
**Impact:** Removes critical security vulnerability

**Current Usage:**
- `scripts/upload-ftp.mjs` - Uses basic-ftp for FTP deployment
- `scripts/deploy-functions.ps1` - PowerShell FTP upload

**Options:**

**Option A: Replace with Node SSH2 (Recommended)**
```bash
npm install --save-dev ssh2
# This allows SFTP which is more secure
```

Then update `upload-ftp.mjs`:
```typescript
import Client from 'ssh2';
// Use SFTP instead of FTP
```

**Option B: Use GitHub Actions for Deployment**
```yaml
# .github/workflows/deploy.yml
name: Deploy to cPanel
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm run build:cpanel
      - uses: milanmk/actions-file-deployer@master
        with:
          remote_url: "ftp://host"
          # ...
```

**Option C: Keep basic-ftp but patch it**
- Risk: Vulnerabilities remain
- Not recommended for production

**Current Deployment Usage:**
```bash
npm run deploy:cpanel  # Uses basic-ftp
npm run deploy:zip     # Creates ZIP (safe, no FTP)
```

**Recommendation:** Use `deploy:zip` + manual upload or switch to Option B

---

## ✅ SHOULD HAVE - Add Before Launch

### Fix #6: Add Critical Path Tests
**Priority:** ⚠️ MEDIUM  
**Time:** 4-6 hours  
**Impact:** Prevents order/payment bugs in production

**Currently:** Only 3 basic tests exist

**Add These Tests:**

**1. Checkout Flow Test** (`src/test/checkout.test.tsx`)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Checkout from '@/pages/Checkout';

describe('Checkout Flow', () => {
  it('adds items to cart', () => {
    // Test add to cart
  });
  
  it('validates customer details', () => {
    // Test form validation
  });
  
  it('sends OTP successfully', () => {
    // Test OTP sending
  });
});
```

**2. Auth Test** (`src/test/auth.test.tsx`)
```typescript
describe('Authentication', () => {
  it('logs in admin user', () => {});
  it('validates password requirements', () => {});
  it('handles failed login', () => {});
});
```

**3. Cart Test** (`src/test/cart.test.tsx`)
```typescript
describe('Shopping Cart', () => {
  it('adds item with size', () => {});
  it('updates quantity', () => {});
  it('calculates totals with shipping', () => {});
});
```

**4. Utilities Test** (`src/test/utils.test.tsx`)
```typescript
describe('Shipping Calculator', () => {
  it('calculates correct shipping fee by piece count', () => {
    // Test shippingFeeByTotalPiecesPhp()
  });
});
```

**Commands:**
```bash
npm test              # Run all tests
npm run test:ui       # Visual UI
npm run test:coverage # See coverage report
```

---

### Fix #7: CORS Configuration
**Priority:** ⚠️ MEDIUM  
**Time:** 10 minutes  
**Impact:** Better security, allows only your domain

**Location:** [supabase/functions/create-order/index.ts](supabase/functions/create-order/index.ts):5

```typescript
// Current:
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // ❌ Allows any origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for, x-real-ip',
};

// Fixed:
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://reveclothingxnobody.com',  // ✅ Only your domain
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for, x-real-ip',
};
```

**Apply to All Edge Functions:**
- supabase/functions/create-order/
- supabase/functions/send-otp/
- supabase/functions/verify-otp/
- Any other publicly accessible functions

---

## 📋 OPTIONAL - Nice to Have

### Fix #8: Add Error Tracking (Sentry)
**Priority:** 📝 OPTIONAL  
**Time:** 2 hours  
**Impact:** Better error monitoring in production

```bash
npm install --save @sentry/react @sentry/tracing
```

Then in `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.MODE,
  tracesSampleRate: 1.0,
});
```

---

## 🎯 Implementation Order (Recommended)

**Week 1 (Before Production):**
1. ✅ Fix security vulnerabilities (`npm audit fix`) - 10 min
2. ✅ Update Twilio phone number - 5 min
3. ✅ Fix CORS configuration - 10 min
4. ⚠️ Fix React hook dependencies - 1 hour
5. ⚠️ Fix critical TypeScript errors (Admin.tsx) - 1-2 hours

**Week 2 (After Launch if Needed):**
6. Add critical path tests - 4-6 hours
7. Replace basic-ftp if needed - 1-2 hours
8. Add error tracking - 2 hours

---

## 🧪 Testing After Fixes

### Verify Security Fix:
```bash
npm audit
# Should show: "found 1 vulnerabilities (high)"
# Only xlsx should remain (cannot be auto-fixed)
```

### Verify TypeScript Fix:
```bash
npm run lint
# Should show: 0-5 errors (from 31)
# 15 warnings about fast-refresh are acceptable
```

### Verify Build Works:
```bash
npm run build
# Should complete in 15-20 seconds
# Should create dist/ folder
```

### Verify Tests Pass:
```bash
npm test
# Should pass all tests
npm run test:coverage
# Should show coverage > 0%
```

---

## 📊 Success Criteria

**After All Fixes:**
- ✅ `npm audit` shows <5 vulnerabilities (only xlsx)
- ✅ `npm run lint` shows <10 errors (TypeScript)
- ✅ `npm run build` completes in <20 seconds
- ✅ `npm test` passes all tests
- ✅ Twilio SMS OTP tested and working
- ✅ No console errors in browser
- ✅ Admin dashboard accessible
- ✅ Checkout flow tested manually

---

## 🚀 Ready for Production

Once all critical fixes are applied:

```bash
# Final verification
npm install
npm audit
npm run lint
npm run test
npm run build

# Deploy
npm run deploy:cpanel
# Or manually upload dist/ to cPanel

# Verify on domain
# Visit: https://reveclothingxnobody.com
```

---

**Estimated Timeline:**
- Critical fixes: 3-4 hours
- High priority fixes: 2-3 hours
- Testing & verification: 2 hours
- **Total: 7-9 hours to production readiness**

**Next Steps:** Start with Fix #1 (npm audit fix) today!
