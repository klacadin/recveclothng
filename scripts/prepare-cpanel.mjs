#!/usr/bin/env node
import { rmSync, mkdirSync, readdirSync, cpSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
const dir = 'cpanel-deploy';
if (existsSync(dir)) rmSync(dir, { recursive: true });
mkdirSync(dir);
// Copy dist files, excluding unnecessary files
const excludeFiles = new Set(['CPANEL_UPLOAD.txt', '.DS_Store', 'Thumbs.db']);
readdirSync('dist').forEach(f => {
  if (!excludeFiles.has(f)) {
    cpSync(join('dist', f), join(dir, f), { recursive: true });
  }
});
console.log('✓ cpanel-deploy ready — upload contents to public_html/');
