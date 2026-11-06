ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS shirt_size text;
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS age integer;