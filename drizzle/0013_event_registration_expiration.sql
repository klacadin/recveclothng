ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS registration_status text,
  ADD COLUMN IF NOT EXISTS registered_at timestamptz,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_confirmed_at timestamptz;
-- Backfill rows that pre-date this feature (only touches columns still NULL,
-- so this is safe to re-run).
UPDATE event_registrations
SET registered_at = COALESCE(registered_at, created_at)
WHERE registered_at IS NULL;
UPDATE event_registrations
SET registration_status = COALESCE(
    registration_status,
    CASE
      WHEN payment_status = 'paid' THEN 'confirmed'
      ELSE 'pending'
    END
  )
WHERE registration_status IS NULL;
UPDATE event_registrations
SET payment_confirmed_at = COALESCE(payment_confirmed_at, paid_at, updated_at, created_at)
WHERE payment_confirmed_at IS NULL
  AND payment_status = 'paid';
-- Registrations that already existed before this feature shipped never had a
-- real 30-minute payment window. Grandfather the pending ones so the new
-- expiration cron never sweeps them (they keep holding their seat
-- indefinitely, exactly like before this migration). Already-paid rows get a
-- cosmetic value only -- expires_at is never consulted once a registration
-- is paid.
UPDATE event_registrations
SET expires_at = 'infinity'::timestamptz
WHERE expires_at IS NULL
  AND payment_status = 'pending';
UPDATE event_registrations
SET expires_at = registered_at + interval '30 minutes'
WHERE expires_at IS NULL;
ALTER TABLE event_registrations
ALTER COLUMN registration_status
SET DEFAULT 'pending',
  ALTER COLUMN registration_status
SET NOT NULL,
  ALTER COLUMN registered_at
SET DEFAULT now(),
  ALTER COLUMN registered_at
SET NOT NULL,
  ALTER COLUMN expires_at
SET NOT NULL;
CREATE INDEX IF NOT EXISTS event_registrations_expires_at_idx ON event_registrations (expires_at);
CREATE INDEX IF NOT EXISTS event_registrations_registration_status_idx ON event_registrations (registration_status);
