# cPanel Deployment - Ready to Upload ✅

**Date:** January 29, 2025  
**Domain:** `reveclothingxnobody.com`  
**Status:** ✅ All files ready for upload

---

## 📦 Build Complete

Production build has been completed and all files are ready in the `dist/` folder.

---

## 📁 Files Ready for Upload

### ✅ Root Files (Upload to `public_html/` root)

- ✅ `.htaccess` - **CRITICAL** - Apache configuration for React Router
- ✅ `index.html` - Main HTML file
- ✅ `manifest.json` - PWA manifest
- ✅ `manifest.webmanifest` - PWA manifest (alternative)
- ✅ `robots.txt` - Search engine crawler instructions
- ✅ `sitemap.xml` - SEO sitemap
- ✅ `sw.js` - Service worker
- ✅ `workbox-*.js` - Workbox runtime
- ✅ `registerSW.js` - Service worker registration

### ✅ Favicon Files

- ✅ `favicon.ico` - Main favicon (32x32)
- ✅ `favicon-16x16.png` - 16x16 favicon
- ✅ `favicon-32x32.png` - 32x32 favicon
- ✅ `favicon-48x48.png` - 48x48 favicon
- ✅ `favicon-64x64.png` - 64x64 favicon
- ✅ `apple-touch-icon.png` - Apple touch icon (180x180)
- ✅ `icon-192.png` - PWA icon (192x192)
- ✅ `icon-512.png` - PWA icon (512x512)

### ✅ Assets Folder (Upload entire `assets/` folder)

- ✅ `assets/index-*.js` - Main JavaScript bundle
- ✅ `assets/index-*.css` - Main CSS bundle
- ✅ `assets/react-vendor-*.js` - React vendor chunk
- ✅ `assets/ui-vendor-*.js` - UI vendor chunk
- ✅ `assets/admin-vendor-*.js` - Admin vendor chunk
- ✅ `assets/Admin-*.js` - Admin component
- ✅ All product images (9 files)
- ✅ All brand images (5 files)

### ✅ Other Files

- ✅ `placeholder.svg` - Placeholder image

---

## 🚀 Upload Instructions

### Option 1: Automated FTP Upload (recommended)

1. Add FTP credentials to `.env` (never commit `.env`):
   ```
   FTP_HOST=ftp.reveclothingxnobody.com
   FTP_USER=your_cpanel_username
   FTP_PASSWORD=your_cpanel_password
   FTP_REMOTE_PATH=public_html
   ```
2. Run:
   ```
   npm run deploy:cpanel
   ```
   This builds, prepares, and uploads via FTP.

   Or upload only (after `npm run build:cpanel`):
   ```
   npm run deploy:ftp
   ```

### Option 2: cPanel File Manager

1. **Log into cPanel**
2. **Open File Manager**
3. **Navigate to `public_html/`**
4. **Backup existing files** (if any) - rename to `public_html_backup`
5. **Upload ALL contents of `dist/` folder:**
   - Select all files and folders in `dist/`
   - Upload to `public_html/`
   - **IMPORTANT:** Enable "Show Hidden Files" to ensure `.htaccess` is uploaded
6. **Verify `.htaccess` is in root** - Check that `.htaccess` is visible in `public_html/`

### Option 3: FTP Client (FileZilla, WinSCP, etc.)

1. **Connect to your server via FTP**
   - Host: `ftp.reveclothingxnobody.com` (or your server IP)
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (or 22 for SFTP)

2. **Navigate to `public_html/` directory**

3. **Upload all contents of `dist/` folder:**
   - Drag and drop all files from `dist/` to `public_html/`
   - **IMPORTANT:** Enable "Show hidden files" in FTP client to see `.htaccess`
   - Maintain folder structure (keep `assets/` folder intact)

---

## ✅ Post-Upload Verification

After uploading, verify:

1. **Website loads:** Visit `https://reveclothingxnobody.com`
2. **React Router works:** Try navigating to `/shop`, `/about`, etc.
3. **Direct URLs work:** Try accessing `/shop` directly in browser
4. **Images load:** Check that product images display correctly
5. **Service Worker:** Check browser DevTools → Application → Service Workers
6. **Favicons:** Check browser tab for favicon
7. **PWA:** Check if "Add to Home Screen" option appears (mobile)

---

## 🔧 Configuration Files Verified

- ✅ **Domain:** `reveclothingxnobody.com` configured in:
  - `sitemap.xml`
  - `robots.txt`
  - `index.html` (canonical URL)
  - `src/config/constants.ts`

- ✅ **Social Media Links Updated:**
  - Facebook: `https://www.facebook.com/ReveClothingBukidnon/`
  - Instagram: `https://www.instagram.com/jingjing`

- ✅ **Events Updated:**
  - Tabuk Adventour
  - Uphill Challenge
  - New Year Trail Run for a Cause
  - Conqueror (placeholder)

---

## 📋 File Structure on Server

After upload, your `public_html/` should look like:

```
public_html/
├── .htaccess                    ← CRITICAL: Must be in root
├── index.html
├── manifest.json
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon-48x48.png
├── favicon-64x64.png
├── apple-touch-icon.png
├── icon-192.png
├── icon-512.png
├── sw.js
├── workbox-*.js
├── registerSW.js
├── placeholder.svg
└── assets/
    ├── index-*.js
    ├── index-*.css
    ├── react-vendor-*.js
    ├── ui-vendor-*.js
    ├── admin-vendor-*.js
    ├── Admin-*.js
    └── [all images]
```

---

## ⚠️ Important Notes

1. **`.htaccess` is CRITICAL** - Without it, React Router won't work
2. **Upload ALL files** - Don't skip any files from `dist/`
3. **Maintain folder structure** - Keep `assets/` folder structure intact
4. **Hidden files** - Make sure to show hidden files to see `.htaccess`
5. **File permissions** - After upload, ensure files have correct permissions (644 for files, 755 for folders)

---

## 🎯 Next Steps

1. ✅ Upload all files from `dist/` to `public_html/`
2. ✅ Verify `.htaccess` is in root directory
3. ✅ Test website functionality
4. ✅ Check all routes work correctly
5. ✅ Verify images and assets load
6. ✅ Test on mobile devices

---

**All files are ready! You can now upload the `dist/` folder contents to cPanel.** 🚀

