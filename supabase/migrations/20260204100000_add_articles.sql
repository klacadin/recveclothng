-- Articles for news/blog - manual entries and Facebook-synced posts
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'facebook')),
  source_url TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles (source);

-- RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read for published articles
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert articles"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can update articles"
  ON articles FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
