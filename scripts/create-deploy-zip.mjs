#!/usr/bin/env node
/**
 * Creates cpanel-deploy.zip for manual upload when FTP can't create directories.
 * Upload the zip to public_html via cPanel File Manager, then Extract.
 */
import { createWriteStream } from 'fs';
import { readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCAL_DIR = join(__dirname, '..', 'cpanel-deploy');
const ZIP_PATH = join(__dirname, '..', 'cpanel-deploy.zip');

async function main() {
  if (!existsSync(LOCAL_DIR)) {
    console.error('cpanel-deploy not found. Run: npm run build:cpanel');
    process.exit(1);
  }

  const output = createWriteStream(ZIP_PATH);
  const archive = archiver('zip', { zlib: { level: 6 } });

  output.on('close', () => {
    console.log(`✓ Created ${ZIP_PATH} (${(archive.pointer() / 1024).toFixed(1)} KB)`);
    console.log('  Upload via cPanel File Manager → public_html → Extract');
  });

  archive.on('error', (err) => {
    console.error('Zip error:', err);
    process.exit(1);
  });

  archive.pipe(output);

  function addDir(dirPath, arcPath = '') {
    const entries = readdirSync(dirPath);
    for (const name of entries) {
      const full = join(dirPath, name);
      const rel = arcPath ? `${arcPath}/${name}` : name;
      if (statSync(full).isDirectory()) {
        addDir(full, rel);
      } else {
        archive.file(full, { name: rel });
      }
    }
  }

  addDir(LOCAL_DIR);
  await archive.finalize();
}

main();
