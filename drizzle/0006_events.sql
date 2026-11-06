-- Events + registrations (promotion, signup, payment, check-in)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  location text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  price numeric(12, 2) NOT NULL DEFAULT 0,
  promo_code text,
  promo_discount_percent integer NOT NULL DEFAULT 0,
  max_attendees integer NOT NULL DEFAULT 0,
  payment_instructions text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE events
ADD COLUMN IF NOT EXISTS image_url text;
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  notes text,
  promo_code_used text,
  subtotal numeric(12, 2) NOT NULL DEFAULT 0,
  discount_amount numeric(12, 2) NOT NULL DEFAULT 0,
  final_amount numeric(12, 2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_reference text,
  hitpay_payment_id text,
  check_in_code text,
  checked_in boolean NOT NULL DEFAULT false,
  checked_in_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS hitpay_payment_id text;
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS check_in_code text;
UPDATE event_registrations
SET check_in_code = upper(substr(replace(id::text, '-', ''), 1, 6))
WHERE check_in_code IS NULL
  OR check_in_code = '';
ALTER TABLE event_registrations
ALTER COLUMN check_in_code
SET NOT NULL;
CREATE INDEX IF NOT EXISTS event_registrations_event_id_idx ON event_registrations (event_id);
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_check_in_code_uidx ON event_registrations (check_in_code);
CREATE INDEX IF NOT EXISTS event_registrations_event_email_idx ON event_registrations (event_id, email);