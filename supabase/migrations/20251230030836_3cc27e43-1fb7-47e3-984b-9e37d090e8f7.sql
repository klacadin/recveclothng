-- Add proof of payment column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS proof_of_payment_url text,
ADD COLUMN IF NOT EXISTS proof_uploaded_at timestamp with time zone;

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment proofs bucket
CREATE POLICY "Users can upload their own payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own payment proofs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all payment proofs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs' 
  AND has_role(auth.uid(), 'admin')
);

-- Allow users to update their own orders with proof of payment
CREATE POLICY "Users can update proof of payment on their orders"
ON public.orders FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());