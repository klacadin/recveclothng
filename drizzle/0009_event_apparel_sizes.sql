ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS singlet_size text;
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS finisher_shirt_size text;
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS crop_top_size text;
UPDATE event_registrations
SET singlet_size = shirt_size
WHERE singlet_size IS NULL
    AND shirt_size IS NOT NULL;