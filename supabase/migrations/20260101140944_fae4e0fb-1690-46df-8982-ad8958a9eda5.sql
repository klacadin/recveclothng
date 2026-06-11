-- =====================================================
-- FIX 1: order_rate_limits - Add RLS policies (ERROR level)
-- This table is only accessed by edge functions with service role key,
-- but needs policies defined to not be completely inaccessible.
-- Adding admin-only access for visibility and cleanup.
-- =====================================================

DROP POLICY IF EXISTS "Admins can view rate limits" ON public.order_rate_limits;
CREATE POLICY "Admins can view rate limits"
ON public.order_rate_limits
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert rate limits" ON public.order_rate_limits;
CREATE POLICY "Admins can insert rate limits"
ON public.order_rate_limits
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete rate limits" ON public.order_rate_limits;
CREATE POLICY "Admins can delete rate limits"
ON public.order_rate_limits
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- FIX 2: checkout_otps - Remove user INSERT/UPDATE policies (WARN level)
-- OTPs must ONLY be created/modified via edge functions (service role).
-- Allowing client-side INSERT/UPDATE creates bypass vulnerability.
-- =====================================================

DROP POLICY IF EXISTS "Users can insert their own OTPs" ON public.checkout_otps;
DROP POLICY IF EXISTS "Users can update their own OTPs" ON public.checkout_otps;

-- Add admin policy for OTP management
DROP POLICY IF EXISTS "Admins can manage OTPs" ON public.checkout_otps;
CREATE POLICY "Admins can manage OTPs"
ON public.checkout_otps
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));