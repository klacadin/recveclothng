-- Default affiliate commission: 15% → 10%
ALTER TABLE affiliates
ALTER COLUMN commission_rate
SET DEFAULT 0.1000;
-- Align existing affiliates that still use the old 15% default
UPDATE affiliates
SET commission_rate = 0.1000,
  updated_at = now()
WHERE commission_rate = 0.1500;
CREATE TABLE IF NOT EXISTS store_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO store_settings (key, value, updated_at)
VALUES (
    'affiliate_default_commission_rate',
    '0.1000',
    now()
  ) ON CONFLICT (key) DO
UPDATE
SET value = EXCLUDED.value,
  updated_at = now();