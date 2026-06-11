-- Create admin user in Supabase
-- This SQL can be run in the Supabase SQL Editor

-- First, create the auth user (you'll need to set this up via Supabase Dashboard or API)
-- Go to Supabase Dashboard → Authentication → Users → Create new user
-- Email: admin@reveclothingxnobody.com
-- Password: [Strong password you choose]
-- Auto confirm: Yes

-- Then, mark the user as admin in the auth.users table:
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(raw_app_meta_data, '{is_admin}', 'true')
WHERE email = 'admin@reveclothingxnobody.com';

-- Verify the user is admin
SELECT id, email, raw_app_meta_data FROM auth.users 
WHERE email = 'admin@reveclothingxnobody.com';
