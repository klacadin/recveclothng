#!/usr/bin/env node
/**
 * FTP upload script for cPanel deployment.
 * Uploads cpanel-deploy/ contents to the remote public_html path.
 *
 * Required env vars:
 *   FTP_HOST     - e.g. ftp.reveclothingxnobody.com or your server IP
 *   FTP_USER     - cPanel username
 *   FTP_PASSWORD - cPanel password
 *
 * Optional env vars:
 *   FTP_REMOTE_PATH - Remote path (default: public_html)
 *   FTP_PORT        - Port (default: 21)
 *   FTP_SECURE      - Use FTPS if "true" (default: false)
 *
 * Usage:
 *   npm run deploy:ftp
 *   Or: node scripts/upload-ftp.mjs
 */

import { Client } from 'basic-ftp';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCAL_DIR = join(__dirname, '..', 'cpanel-deploy');

async function loadEnv() {
  try {
    const dotenv = await import('dotenv');
    (dotenv.default || dotenv).config?.();
  } catch {
    // dotenv optional
  }
}

function getEnv(name, defaultValue = '') {
  return process.env[name] ?? defaultValue;
}

async function uploadDirectory(client, localPath, remotePath = '') {
  const entries = readdirSync(localPath, { withFileTypes: true });
  for (const entry of entries) {
    const localFull = join(localPath, entry.name);
    const remoteFull = remotePath ? `${remotePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      try {
        await client.ensureDir(remoteFull);
      } catch (mkErr) {
        console.error(`  Could not create dir ${remoteFull}: ${mkErr.message}`);
        console.error('  Tip: Your FTP account may not allow creating folders.');
        console.error('  Use: npm run build:zip then upload cpanel-deploy.zip via cPanel File Manager and extract.');
        throw mkErr;
      }
      await uploadDirectory(client, localFull, remoteFull);
    } else {
      try {
        await client.uploadFrom(localFull, remoteFull);
        console.log('  ↑', remoteFull);
      } catch (err) {
        console.error(`  ✗ ${remoteFull}: ${err.message}`);
        throw err;
      }
    }
  }
}

async function main() {
  await loadEnv();

  const host = getEnv('FTP_HOST');
  const user = getEnv('FTP_USER');
  const password = getEnv('FTP_PASSWORD');
  const remotePath = getEnv('FTP_REMOTE_PATH', 'public_html');
  const port = parseInt(getEnv('FTP_PORT', '21'), 10);
  const secure = getEnv('FTP_SECURE', 'false').toLowerCase() === 'true';

  if (!host || !user || !password) {
    console.error('Missing FTP credentials. Set FTP_HOST, FTP_USER, FTP_PASSWORD in .env');
    console.error('Example .env:');
    console.error('  FTP_HOST=ftp.reveclothingxnobody.com');
    console.error('  FTP_USER=your_cpanel_user');
    console.error('  FTP_PASSWORD=your_password');
    console.error('  FTP_REMOTE_PATH=public_html');
    process.exit(1);
  }

  if (!existsSync(LOCAL_DIR)) {
    console.error('cpanel-deploy folder not found. Run: npm run build:cpanel');
    process.exit(1);
  }

  const client = new Client(60000);
  client.ftp.verbose = process.env.FTP_VERBOSE === 'true';

  try {
    console.log(`Connecting to ${host}:${port} (secure: ${secure})...`);
    await client.access({
      host,
      port,
      user,
      password,
      secure,
    });

    const targetPath = remotePath || '.';
    console.log(`Uploading to ${targetPath === '.' ? '(current directory)' : targetPath}...`);

    let uploadBase = '';
    if (targetPath && targetPath !== '.') {
      const parts = targetPath.split('/').filter(Boolean);
      if (parts.length >= 2) {
        // e.g. public_html/staging: cd to parent, ensure subdir, upload with prefix (avoids cd into subdir)
        const parentPath = parts.slice(0, -1).join('/');
        const subDir = parts[parts.length - 1];
        for (const segment of parts.slice(0, -1)) {
          try {
            await client.cd(segment);
          } catch (cdErr) {
            try {
              await client.ensureDir(segment);
              await client.cd(segment);
            } catch (e) {
              const list = await client.list();
              console.error(`Could not access "${targetPath}". Current directory contents:`);
              list.forEach((f) => console.error('  ', f.name));
              throw cdErr;
            }
          }
        }
        try {
          await client.ensureDir(subDir);
        } catch (e) {
          console.error(`Could not create ${subDir}: ${e.message}`);
        }
        uploadBase = subDir;
      } else {
        const segment = parts[0];
        try {
          await client.cd(segment);
        } catch (cdErr) {
          try {
            await client.ensureDir(segment);
            await client.cd(segment);
          } catch (e) {
            const list = await client.list();
            console.error(`Could not access "${targetPath}". Current directory contents:`);
            list.forEach((f) => console.error('  ', f.name));
            throw cdErr;
          }
        }
        uploadBase = '';
      }
    }
    await uploadDirectory(client, LOCAL_DIR, uploadBase);

    console.log('✓ FTP upload complete');
  } catch (err) {
    console.error('FTP upload failed:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

main();
