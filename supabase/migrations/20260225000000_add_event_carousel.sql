-- Event carousel for "Join Us" / Upcoming Events section (up to 9 photos)
CREATE TABLE IF NOT EXISTS event_carousel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_carousel_created ON event_carousel (created_at DESC);

-- RLS
ALTER TABLE event_carousel ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Event carousel is viewable by everyone"
  ON event_carousel FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert event carousel"
  ON event_carousel FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can update event carousel"
  ON event_carousel FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can delete event carousel"
  ON event_carousel FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
