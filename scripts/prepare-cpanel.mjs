#!/usr/bin/env node
import { rmSync, mkdirSync, readdirSync, cpSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
const dir = 'cpanel-deploy';
if (existsSync(dir)) rmSync(dir, { recursive: true });
mkdirSync(dir);
readdirSync('dist').forEach(f => cpSync(join('dist', f), join(dir, f), { recursive: true }));
writeFileSync(join(dir, 'CPANEL_UPLOAD.txt'), `CPANEL UPLOAD INSTRUCTIONS
==========================

Upload the CONTENTS of this folder to:
  Main domain:  public_html/
  Staging:      public_html/staging/

Option A: ZIP (if FTP can't create folders)
  npm run build:cpanel && npm run deploy:zip
  Upload cpanel-deploy.zip to public_html via File Manager, then Extract.

Option B: FTP (automated)
  npm run deploy:ftp
  (Requires FTP_HOST, FTP_USER, FTP_PASSWORD in .env)

Option C: Manual
1. cPanel File Manager → public_html (or public_html/staging)
2. Delete existing files (for clean deploy)
3. Upload all files from this folder
4. Enable "Show Hidden Files" to upload .htaccess
`);
console.log('✓ cpanel-deploy ready — upload contents to public_html/');
