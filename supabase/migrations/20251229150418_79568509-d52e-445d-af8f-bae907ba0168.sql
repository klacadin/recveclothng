-- Create table for OTP codes
CREATE TABLE public.checkout_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.checkout_otps ENABLE ROW LEVEL SECURITY;

-- Users can view their own OTPs
CREATE POLICY "Users can view their own OTPs"
ON public.checkout_otps
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own OTPs
CREATE POLICY "Users can insert their own OTPs"
ON public.checkout_otps
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own OTPs
CREATE POLICY "Users can update their own OTPs"
ON public.checkout_otps
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_checkout_otps_user_email ON public.checkout_otps(user_id, email);

-- Cleanup old OTPs trigger function
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

-- Trigger to cleanup expired OTPs on new insert
CREATE TRIGGER cleanup_otps_on_insert
AFTER INSERT ON public.checkout_otps
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_expired_otps();