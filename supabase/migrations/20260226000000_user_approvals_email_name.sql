-- Store email and full_name in user_approvals so admins see who to approve (no edge function needed)
ALTER TABLE public.user_approvals
ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS full_name TEXT;
-- Update trigger to populate email and full_name when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
DECLARE _email TEXT;
_full_name TEXT;
BEGIN _email := COALESCE(NEW.email, '');
_full_name := COALESCE(
  NEW.raw_user_meta_data->>'full_name',
  NEW.raw_user_meta_data->>'name',
  NEW.raw_user_meta_data->>'user_name',
  ''
);
INSERT INTO public.user_approvals (user_id, status, email, full_name)
VALUES (NEW.id, 'pending', _email, _full_name) ON CONFLICT (user_id) DO
UPDATE
SET email = COALESCE(
    NULLIF(TRIM(EXCLUDED.email), ''),
    user_approvals.email
  ),
  full_name = COALESCE(
    NULLIF(TRIM(EXCLUDED.full_name), ''),
    user_approvals.full_name
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Backfill existing rows from auth.users
UPDATE public.user_approvals ua
SET email = COALESCE(au.email, ''),
  full_name = COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'user_name',
    ''
  )
FROM auth.users au
WHERE ua.user_id = au.id
  AND (
    ua.email IS NULL
    OR ua.email = ''
    OR ua.full_name IS NULL
  );