#!/usr/bin/env node
/**
 * One-off: set password for a Supabase Auth user (e.g. admin) by email.
 * Uses Auth Admin API (service role key required).
 *
 * Add to .env (do not commit):
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 *
 * Usage:
 *   node scripts/set-admin-password.mjs <email> <new_password>
 * Example:
 *   node scripts/set-admin-password.mjs reveclothing214@gmail.com Themaster_14344
 */

import { createClient } from '@supabase/supabase-js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

async function loadEnv() {
  try {
    const dotenv = await import('dotenv');
    (dotenv.default || dotenv).config?.({ path: join(rootDir, '.env') });
  } catch {
    // dotenv optional
  }
}

async function main() {
  await loadEnv();

  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.argv[2];
  const password = process.argv[3];

  if (!url) {
    console.error('Missing VITE_SUPABASE_URL in .env');
    process.exit(1);
  }
  if (!serviceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env. Get it from: Supabase Dashboard → Project Settings → API → service_role key (secret). Add to .env and run again.');
    process.exit(1);
  }
  if (!email || !password) {
    console.error('Usage: node scripts/set-admin-password.mjs <email> <new_password>');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    console.error('List users failed:', listError.message);
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase();
  let user = users?.find((u) => u.email?.toLowerCase() === normalizedEmail);

  if (!user) {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: email,
      },
    });
    if (createError) {
      console.error('Create user failed:', createError.message);
      process.exit(1);
    }
    user = created.user;
  } else {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, { password });
    if (error) {
      console.error('Update password failed:', error.message);
      process.exit(1);
    }
    user = data.user ?? user;
  }

  if (!user) {
    console.error('Could not resolve user for email:', email);
    process.exit(1);
  }

  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({ user_id: user.id, role: 'admin' }, { onConflict: 'user_id,role' });
  if (roleError) {
    console.error('Admin role upsert failed:', roleError.message);
    process.exit(1);
  }

  const { error: approvalError } = await supabase
    .from('user_approvals')
    .upsert({ user_id: user.id, status: 'approved' }, { onConflict: 'user_id' });
  if (approvalError) {
    console.error('Approval upsert failed:', approvalError.message);
    process.exit(1);
  }

  console.log('Password updated successfully for', email);
}

main();
