-- Make khlacadin@gmail.com and reveclothing214@gmail.com superadmin
-- Run in: https://supabase.com/dashboard/project/unaodlytdymouicuuywb/sql/new

-- 1. Grant admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE lower(email) IN ('khlacadin@gmail.com', 'reveclothing214@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Ensure user is approved
INSERT INTO public.user_approvals (user_id, status)
SELECT id, 'approved'
FROM auth.users
WHERE lower(email) IN ('khlacadin@gmail.com', 'reveclothing214@gmail.com')
ON CONFLICT (user_id) DO UPDATE SET status = 'approved';

-- Verify
SELECT 
  u.email, 
  ur.role, 
  ua.status as approval_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.user_approvals ua ON ua.user_id = u.id
WHERE lower(u.email) IN ('khlacadin@gmail.com', 'reveclothing214@gmail.com');
