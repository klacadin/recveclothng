-- Add attempts column to checkout_otps table for brute-force protection
ALTER TABLE public.checkout_otps ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0;