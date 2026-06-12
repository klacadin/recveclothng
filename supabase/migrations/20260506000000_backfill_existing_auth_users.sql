-- Backfill approval rows for existing users after project migration.
-- Existing authenticated users without an approval row should not be blocked.
INSERT INTO public.user_approvals (user_id, status)
SELECT u.id, 'approved'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1
  FROM public.user_approvals ua
  WHERE ua.user_id = u.id
);

-- Restore the known admin account used by the app documentation.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'khlacadin@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_approvals (user_id, status)
SELECT id, 'approved'
FROM auth.users
WHERE email = 'khlacadin@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET status = 'approved';
