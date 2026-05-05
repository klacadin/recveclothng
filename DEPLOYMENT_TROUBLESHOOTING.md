# Deployment Troubleshooting Guide

## Issue 1: staging.reveclothingxnobody.com — DNS_PROBE_FINISHED_NXDOMAIN

**Cause:** The subdomain `staging` has no DNS record, so the domain can’t resolve.

### Fix: Add DNS record in cPanel

1. Log in to **cPanel** for reveclothingxnobody.com.
2. Open **Domains** → **Subdomains** or **Zone Editor**.
3. Create the subdomain:

   **Option A – Subdomains**
   - Subdomain: `staging`
   - Document Root: `public_html/staging` (or `staging`)
   - Click **Create**.

   **Option B – Zone Editor**
   - Add **A Record**:
     - Name: `staging` (or `staging.reveclothingxnobody.com`)
     - Points to: your server IP (same as main domain)
   - Or add **CNAME Record**:
     - Name: `staging`
     - Points to: `reveclothingxnobody.com`

4. Wait 5–15 minutes for DNS propagation.
5. Verify: `ping staging.reveclothingxnobody.com` or use https://dnschecker.org

---

## Issue 2: Files not updated from ZIP

**Cause:** Wrong extraction location, caching, or old files still in place.

### Fix: Clean deploy

1. **Remove old staging files** from `public_html/staging/` (or the staging root).

2. **Upload `staging-build.zip`** to that staging folder.

3. **Extract** so the ZIP contents go directly into the folder:
   - Correct: `public_html/staging/index.html` (at root)
   - Wrong: `public_html/staging/staging-build/index.html` (nested)

4. **Clear caches:**
   - cPanel → **Cache** (if available) → Clear/Flush
   - Browser: hard refresh (Ctrl+Shift+R) or private window

5. **Confirm files:**
   - `index.html` at staging root
   - `assets/` with `.js` and `.css`
   - `.htaccess` at staging root

### Alternative: Upload `dist` contents directly

1. Delete everything in `public_html/staging/`.
2. Upload all contents of `dist/` (not the `dist` folder itself) to `public_html/staging/`.
3. Ensure `.htaccess` is included.

---

## Issue 3: DB reverting to old state

**Possible causes:**
- Different Supabase project (staging vs production)
- Migrations reverted or run on wrong project
- `.env` pointing to wrong project

### Fix: Verify database configuration

1. **Environment variables**
   - Check `.env` for staging:
     - `VITE_SUPABASE_URL` → same Supabase project
     - `VITE_SUPABASE_PUBLISHABLE_KEY` → same project’s anon key

2. **Supabase project**
   - Current project: `unaodlytdymouicuuywb`
   - URL: `https://unaodlytdymouicuuywb.supabase.co`

3. **Re-run migrations if needed**
   - Open [SQL Editor](https://supabase.com/dashboard/project/unaodlytdymouicuuywb/sql/new)
   - Run in this order:
     1. `COMPLETE_SETUP.sql`
     2. `ADMIN_UPGRADE.sql`
     3. `supabase/migrations/20260130000000_sync_canonical_nobody_products.sql`

4. **Avoid restore / branch rollback**
   - Supabase Dashboard → Settings → General
   - Make sure you’re not on a branch or using PITR that would roll the DB back.

---

## Quick checklist

| Step | Action | Status |
|------|--------|--------|
| 1 | Add DNS record for `staging.reveclothingxnobody.com` | ☐ |
| 2 | Wait for DNS propagation (~15 min) | ☐ |
| 3 | Delete old files in staging folder | ☐ |
| 4 | Upload & extract ZIP to correct folder | ☐ |
| 5 | Verify `.htaccess` present | ☐ |
| 6 | Clear server & browser cache | ☐ |
| 7 | Confirm Supabase `.env` for staging | ☐ |
| 8 | Re-run migrations if DB is wrong | ☐ |

---

## Rebuild commands (if needed)

```bash
# Rebuild for staging
npm run build

# Create fresh staging ZIP
Compress-Archive -Path "dist\*" -DestinationPath "staging-build.zip" -Force
```
