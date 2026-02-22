-- Vouchers table for discount codes
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value >= 0),
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER,
  times_used INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vouchers_code ON public.vouchers(UPPER(code));
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON public.vouchers(is_active) WHERE is_active = true;

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Admins can manage vouchers (service role bypasses RLS for create-order/validation)
CREATE POLICY "Admins can select vouchers" ON public.vouchers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert vouchers" ON public.vouchers FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update vouchers" ON public.vouchers FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete vouchers" ON public.vouchers FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_vouchers_updated_at ON public.vouchers;
CREATE TRIGGER update_vouchers_updated_at
  BEFORE UPDATE ON public.vouchers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.vouchers IS 'Discount voucher codes for checkout';
