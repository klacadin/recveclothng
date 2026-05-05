# REVE Clothing - cPanel Deployment Guide

**Domain:** `reveclothingxnobody.com`  
**Document Root:** `public_html` (or `www` depending on your hosting)

---

## GitHub Actions Pipeline

A CI/CD pipeline builds and deploys the app (including J&T COD) on every push to `main`.

**Workflow:** `.github/workflows/deploy-cpanel.yml`

### Triggers
- Push to `main`
- Manual run via **Actions** → **Deploy to cPanel** → **Run workflow**

### Secrets (Settings → Secrets and variables → Actions)

| Secret | Required | Description |
|--------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon key |
| `FTP_HOST` | For FTP deploy | e.g. ftp.reveclothingxnobody.com |
| `FTP_USER` | For FTP deploy | cPanel username |
| `FTP_PASSWORD` | For FTP deploy | cPanel password |
| `FTP_REMOTE_PATH` | Optional | Default: public_html |

### Outputs
- **Artifact:** `cpanel-deploy.zip` — Download from the workflow run for manual upload
- **FTP deploy:** Automatic upload when FTP secrets are configured

---

## Prerequisites

- ✅ cPanel access
- ✅ FTP/File Manager access
- ✅ `.env` file with production environment variables
- ✅ Node.js installed locally (for building)

---

## Step 1: Prepare Environment Variables

**IMPORTANT:** Environment variables must be set in your `.env` file **before building**. Vite bakes these values into the JavaScript bundle at build time.

1. Ensure your `.env` file contains:
   ```env
   VITE_SUPABASE_URL=https://unaodlytdymouicuuywb.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
   ```

2. **DO NOT** commit `.env` to version control (it should be in `.gitignore`)

---

## Step 2: Build Production Bundle

Run the build command locally:

```bash
npm run build
```

This will:
- Create optimized production files in the `dist/` folder
- Bake environment variables into the bundle
- Generate service worker files for PWA
- Optimize and minify all assets

**Expected output:**
- `dist/index.html`
- `dist/assets/` (JS, CSS, images)
- `dist/sw.js` (service worker)
- `dist/workbox-*.js` (Workbox runtime)
- `dist/manifest.webmanifest` (PWA manifest)
- `dist/robots.txt`
- `dist/sitemap.xml`

**Build time:** ~5-10 seconds

---

## Step 3: Test Build Locally (Optional but Recommended)

Before uploading, test the build locally:

```bash
npm run preview
```

Visit `http://localhost:4173` and verify:
- ✅ Site loads correctly
- ✅ All routes work (try `/shop`, `/about`, etc.)
- ✅ Images load
- ✅ No console errors
- ✅ Supabase connection works

---

## Step 4: Upload Files to cPanel

### Option A: Automated FTP (Recommended)

1. Add to `.env`:
   ```
   FTP_HOST=ftp.reveclothingxnobody.com
   FTP_USER=your_cpanel_username
   FTP_PASSWORD=your_cpanel_password
   FTP_REMOTE_PATH=public_html
   ```
2. Run:
   ```bash
   npm run deploy:cpanel
   ```
   Builds and uploads via FTP in one step.

   Or upload only (after build):
   ```bash
   npm run build:cpanel
   npm run deploy:ftp
   ```

### Option B: Using cPanel File Manager

1. **Log into cPanel**
2. **Open File Manager**
3. **Navigate to `public_html`** (or `www` if that's your document root)
4. **Backup existing files** (if any) - rename current folder to `public_html_backup`
5. **Upload all files from `dist/` folder:**
   - Select all files in `dist/` folder
   - Upload to `public_html/`
   - Ensure `.htaccess` is uploaded (it may be hidden - enable "Show Hidden Files")

### Option C: Using FTP Client (FileZilla, WinSCP, etc.)

1. **Connect to your server via FTP**
   - Host: `ftp.reveclothingxnobody.com` (or your server IP)
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (or 22 for SFTP)

2. **Navigate to `public_html/` directory**

3. **Upload all contents of `dist/` folder:**
   - Drag and drop all files from `dist/` to `public_html/`
   - Ensure `.htaccess` is uploaded (enable "Show hidden files" in FTP client)

### Files to Upload

```
public_html/
├── .htaccess                    ← IMPORTANT: Must be in root
├── index.html
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── favicon.ico (if exists)
├── sw.js
├── workbox-*.js
└── assets/
    ├── index-*.js
    ├── index-*.css
    └── [images and other assets]
```

---

## Step 5: Verify .htaccess File

**CRITICAL:** The `.htaccess` file must be in the root of `public_html/` for React Router to work.

1. In cPanel File Manager, ensure "Show Hidden Files" is enabled
2. Verify `.htaccess` exists in `public_html/`
3. If missing, upload it manually from `public/.htaccess`

---

## Step 6: Set File Permissions

Set appropriate permissions:

- **Files:** `644` (rw-r--r--)
- **Folders:** `755` (rwxr-xr-x)
- **.htaccess:** `644`

In cPanel File Manager:
1. Select all files
2. Right-click → "Change Permissions"
3. Set to `644` for files, `755` for folders

---

## Step 7: Test Your Website

1. **Visit:** `https://reveclothingxnobody.com`
2. **Verify:**
   - ✅ Homepage loads
   - ✅ Navigation works (try `/shop`, `/about`, etc.)
   - ✅ No 404 errors on direct URL access
   - ✅ Images load correctly
   - ✅ Supabase connection works (try logging in)
   - ✅ PWA works (check for service worker in DevTools)

3. **Test React Router:**
   - Visit `https://reveclothingxnobody.com/shop` directly
   - Should load correctly (not show 404)
   - If you see 404, `.htaccess` is not working - check file location and permissions

---

## Step 8: Submit Sitemap to Search Engines

1. **Google Search Console:**
   - Go to https://search.google.com/search-console
   - Add property: `reveclothingxnobody.com`
   - Submit sitemap: `https://reveclothingxnobody.com/sitemap.xml`

2. **Bing Webmaster Tools:**
   - Go to https://www.bing.com/webmasters
   - Add site: `reveclothingxnobody.com`
   - Submit sitemap: `https://reveclothingxnobody.com/sitemap.xml`

---

## Troubleshooting

### Issue: 404 Error on Direct URL Access

**Problem:** React Router routes return 404 when accessed directly.

**Solution:**
- Verify `.htaccess` is in `public_html/` root
- Check `.htaccess` file permissions (should be 644)
- Ensure `mod_rewrite` is enabled on your server (contact hosting if needed)
- Check Apache error logs in cPanel

### Issue: Environment Variables Not Working

**Problem:** Supabase connection fails.

**Solution:**
- Environment variables are baked into the build - you must rebuild if you change them
- Verify `.env` file has correct values before building
- Rebuild: `npm run build`
- Re-upload `dist/` folder

### Issue: Service Worker Not Working

**Problem:** PWA features not working.

**Solution:**
- Verify `sw.js` and `workbox-*.js` files are uploaded
- Check browser console for service worker errors
- Ensure HTTPS is enabled (required for service workers)
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Images Not Loading

**Problem:** Images return 404.

**Solution:**
- Verify all files in `dist/assets/` are uploaded
- Check file paths in browser DevTools Network tab
- Ensure image files have correct permissions (644)

### Issue: Build Fails

**Problem:** `npm run build` fails.

**Solution:**
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npx tsc --noEmit`
- Check for linting errors: `npm run lint`
- Verify Node.js version (should be 18+)

---

## Updating the Website

When you need to update the site:

1. **Make changes to your code**
2. **Update `.env` if needed** (before building)
3. **Rebuild:** `npm run build`
4. **Upload new files** from `dist/` to `public_html/`
5. **Clear browser cache** (users will get updates via service worker)

---

## File Structure After Deployment

```
public_html/
├── .htaccess                    # Apache config for SPA routing
├── index.html                   # Main HTML file
├── manifest.webmanifest         # PWA manifest
├── robots.txt                   # SEO robots file
├── sitemap.xml                  # SEO sitemap
├── sw.js                        # Service worker
├── workbox-*.js                 # Workbox runtime
├── favicon.ico                  # Site icon
└── assets/
    ├── index-*.js               # JavaScript bundles
    ├── index-*.css              # CSS bundles
    └── [product images, etc.]   # Static assets
```

---

## Security Notes

- ✅ `.htaccess` includes security headers
- ✅ Hidden files (starting with `.`) are protected
- ✅ Directory listing is disabled
- ⚠️ Keep `.env` file secure (never commit to git)
- ⚠️ Regularly update dependencies: `npm audit`

---

## Performance Optimization

The build includes:
- ✅ Code splitting (separate vendor chunks)
- ✅ Gzip compression (via .htaccess)
- ✅ Browser caching (via .htaccess)
- ✅ Image optimization (WebP support)
- ✅ Service worker caching (PWA)

---

## J&T COD Integration

- **J&T Order API reference:** [docs/JT_ORDER_API.md](docs/JT_ORDER_API.md) — For future waybill API integration
- **VIP portal:** [vip.jtexpress.ph](https://vip.jtexpress.ph) — Quick Order, Order Waybill

---

## Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Check cPanel error logs
3. Verify file permissions
4. Test with `npm run preview` locally first

---

**Last Updated:** January 2025  
**Domain:** reveclothingxnobody.com

