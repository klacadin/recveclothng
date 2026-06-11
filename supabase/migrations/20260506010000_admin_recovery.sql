-- Restore admin access for the two known operator accounts after project migration.
-- This only applies to users that already exist in auth.users.

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE lower(email) IN ('khlacadin@gmail.com', 'reveclothing214@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_approvals (user_id, status)
SELECT id, 'approved'
FROM auth.users
WHERE lower(email) IN ('khlacadin@gmail.com', 'reveclothing214@gmail.com')
ON CONFLICT (user_id) DO UPDATE SET status = 'approved';
