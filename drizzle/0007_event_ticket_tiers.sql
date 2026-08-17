-- Distance / ticket options on events, plus selected ticket on registrations
ALTER TABLE events ADD COLUMN IF NOT EXISTS ticket_tiers jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS ticket_slug text;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS ticket_name text;
