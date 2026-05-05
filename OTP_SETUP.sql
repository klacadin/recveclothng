-- =====================================================
-- OTP System Setup for Checkout Verification
-- Run this in: https://supabase.com/dashboard/project/unaodlytdymouicuuywb/sql/new
-- =====================================================

-- Step 1: Create checkout_otps table
CREATE TABLE IF NOT EXISTS public.checkout_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 2: Enable RLS
ALTER TABLE public.checkout_otps ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies (users can only view their own OTPs)
DROP POLICY IF EXISTS "Users can view their own OTPs" ON public.checkout_otps;
DROP POLICY IF EXISTS "Users can insert their own OTPs" ON public.checkout_otps;
DROP POLICY IF EXISTS "Users can update their own OTPs" ON public.checkout_otps;
DROP POLICY IF EXISTS "Admins can manage OTPs" ON public.checkout_otps;

CREATE POLICY "Users can view their own OTPs"
ON public.checkout_otps
FOR SELECT
USING (auth.uid() = user_id);

-- Admin policy for OTP management (Edge Functions use service role, bypass RLS)
CREATE POLICY "Admins can manage OTPs"
ON public.checkout_otps
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 4: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_checkout_otps_user_email ON public.checkout_otps(user_id, email);
CREATE INDEX IF NOT EXISTS idx_checkout_otps_expires_at ON public.checkout_otps(expires_at);

-- Step 5: Cleanup old OTPs trigger function
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.checkout_otps WHERE expires_at < now();
  RETURN NEW;
END;
$$;

-- Step 6: Trigger to cleanup expired OTPs on new insert
DROP TRIGGER IF EXISTS cleanup_otps_on_insert ON public.checkout_otps;
CREATE TRIGGER cleanup_otps_on_insert
AFTER INSERT ON public.checkout_otps
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_expired_otps();

-- =====================================================
-- Verification: Check if table was created successfully
-- =====================================================
SELECT 
  'checkout_otps table created successfully!' as status,
  count(*) as current_otps
FROM public.checkout_otps;
