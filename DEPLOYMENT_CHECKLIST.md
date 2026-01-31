# cPanel Deployment Checklist

**Domain:** `reveclothingxnobody.com`  
**Build Date:** January 29, 2025

---

## Pre-Deployment Checklist

- [x] Domain references updated in `sitemap.xml`
- [x] Domain references updated in `robots.txt`
- [x] Canonical URL updated in `index.html`
- [x] `.htaccess` file created for SPA routing
- [x] Production build completed (`npm run build`)
- [x] `.htaccess` copied to `dist/` folder
- [ ] `.env` file verified with correct Supabase credentials
- [ ] Build tested locally (`npm run preview`)

---

## Files Ready for Upload

All files in the `dist/` folder are ready to upload to `public_html/`:

### Root Files
- [x] `.htaccess` - **CRITICAL: Must be in root**
- [x] `index.html`
- [x] `manifest.webmanifest`
- [x] `manifest.json`
- [x] `robots.txt`
- [x] `sitemap.xml`
- [x] `favicon.ico` - Main favicon (32x32)
- [x] `favicon-16x16.png` - 16x16 favicon
- [x] `favicon-32x32.png` - 32x32 favicon
- [x] `favicon-48x48.png` - 48x48 favicon
- [x] `favicon-64x64.png` - 64x64 favicon
- [x] `apple-touch-icon.png` - Apple touch icon (180x180)
- [x] `icon-192.png` - PWA icon (192x192)
- [x] `icon-512.png` - PWA icon (512x512)
- [x] `sw.js` - Service worker
- [x] `workbox-4b126c97.js` - Workbox runtime
- [x] `registerSW.js` - Service worker registration

### Assets Folder
- [x] `assets/index-*.js` - Main JavaScript bundle (548KB)
- [x] `assets/index-*.css` - Main CSS bundle (75KB)
- [x] `assets/react-vendor-*.js` - React vendor chunk (162KB)
- [x] `assets/ui-vendor-*.js` - UI vendor chunk (100KB)
- [x] `assets/admin-vendor-*.js` - Admin vendor chunk (0.41KB)
- [x] `assets/Admin-*.js` - Admin component (60KB)
- [x] All product images (18 files)
- [x] All brand images

---

## Upload Instructions

1. **Log into cPanel**
2. **Open File Manager**
3. **Navigate to `public_html/`**
4. **Backup existing files** (if any)
5. **Upload ALL contents of `dist/` folder to `public_html/`**
6. **Ensure `.htaccess` is uploaded** (enable "Show Hidden Files")

---

## Post-Deployment Verification

After uploading, verify:

- [ ] Website loads at `https://reveclothingxnobody.com`
- [ ] Homepage displays correctly
- [ ] Navigation works (`/shop`, `/about`, etc.)
- [ ] Direct URL access works (e.g., `/shop` doesn't show 404)
- [ ] Images load correctly
- [ ] Supabase connection works (try logging in)
- [ ] Service worker registers (check DevTools → Application → Service Workers)
- [ ] PWA manifest loads (`/manifest.webmanifest`)
- [ ] Sitemap accessible (`/sitemap.xml`)
- [ ] Robots.txt accessible (`/robots.txt`)
- [ ] Favicon displays correctly in browser tab
- [ ] Apple touch icon works (test on iOS device or simulator)

---

## Environment Variables

**IMPORTANT:** Environment variables are baked into the build. If you need to change them:

1. Update `.env` file
2. Rebuild: `npm run build`
3. Re-upload `dist/` folder

Current values (verify these are correct):
- `VITE_SUPABASE_URL=https://txiwvjfdlxgwjtaibbpb.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY=[your_key]`

---

## Troubleshooting

### If React Router routes show 404:
- Verify `.htaccess` is in `public_html/` root
- Check file permissions (should be 644)
- Contact hosting to ensure `mod_rewrite` is enabled

### If Supabase doesn't work:
- Environment variables are in the build - rebuild if needed
- Check browser console for errors
- Verify Supabase project is active

### If service worker doesn't work:
- Ensure HTTPS is enabled (required for service workers)
- Check browser console for errors
- Clear browser cache

---

## File Permissions

Set these permissions after upload:
- **Files:** `644`
- **Folders:** `755`
- **.htaccess:** `644`

---

## Next Steps After Deployment

1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools
3. Test all functionality thoroughly
4. Monitor error logs in cPanel
5. Set up regular backups

---

**Ready to Deploy:** ✅ Yes  
**Build Location:** `dist/` folder  
**Total Files:** ~40 files (including favicons)  
**Total Size:** ~3.8 MB

**Favicon Files Generated:**
- ✅ favicon.ico (1.72 KB)
- ✅ favicon-16x16.png (0.66 KB)
- ✅ favicon-32x32.png (1.72 KB)
- ✅ favicon-48x48.png (2.96 KB)
- ✅ favicon-64x64.png (4.27 KB)
- ✅ apple-touch-icon.png (16.67 KB)
- ✅ icon-192.png (17.61 KB)
- ✅ icon-512.png (62.66 KB)

