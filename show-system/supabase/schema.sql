-- TattooNOW Weekly Show Database Schema
-- Supabase PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_number INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  air_date TIMESTAMPTZ NOT NULL,
  host TEXT NOT NULL DEFAULT 'Ryan Pierce',
  status TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, live, completed, archived

  -- QR codes
  qr_code_url TEXT,
  qr_code_message TEXT DEFAULT 'Book Your Free Consultation',
  highlevel_qr_url TEXT,
  highlevel_campaign_name TEXT,

  -- Social media
  youtube_description TEXT,
  facebook_description TEXT,
  linkedin_description TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title)
  ) STORED
);

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  title TEXT, -- "Award-Winning Watercolor Artist"
  style TEXT, -- "Watercolor & Botanical"
  location TEXT, -- "Portland, OR"

  -- Social media
  instagram TEXT,
  website TEXT,
  facebook TEXT,
  tiktok TEXT,

  -- Contact
  email TEXT,
  phone TEXT,

  -- Portfolio
  portfolio_images JSONB DEFAULT '[]'::jsonb,
  featured_image TEXT,

  -- HighLevel
  highlevel_contact_id TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(bio, '') || ' ' || coalesce(style, ''))
  ) STORED
);

-- Segments table (episode segments)
CREATE TABLE IF NOT EXISTS segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  segment_number INTEGER NOT NULL, -- 1, 2, or 3
  segment_type TEXT NOT NULL, -- 'interview' or 'education'

  -- Interview segment data
  guest_id UUID REFERENCES guests(id),
  discussion_topics JSONB DEFAULT '[]'::jsonb,
  discussion_guide TEXT,

  -- Education segment data
  slides JSONB DEFAULT '[]'::jsonb, -- Array of slide objects

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique segment numbers per episode
  UNIQUE(episode_id, segment_number)
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,

  -- Platform stats
  platform TEXT NOT NULL, -- 'youtube', 'facebook', 'linkedin', 'twitch', 'twitter'
  viewers INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  watch_time_minutes INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2), -- percentage

  -- QR code tracking
  qr_scans INTEGER DEFAULT 0,
  qr_conversions INTEGER DEFAULT 0,

  -- Chat stats
  chat_messages INTEGER DEFAULT 0,
  unique_chatters INTEGER DEFAULT 0,

  -- Timestamp
  recorded_at TIMESTAMPTZ DEFAULT NOW(),

  -- Raw data dump
  raw_data JSONB
);

-- Social media posts table (for tracking countdown posts)
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,

  post_type TEXT NOT NULL, -- 'countdown-3d', 'countdown-1d', 'countdown-3h', 'live', 'clip'
  platform TEXT NOT NULL, -- 'instagram', 'facebook', 'tiktok', 'youtube', 'linkedin'

  -- Placid data
  placid_template_id TEXT,
  placid_image_url TEXT,

  -- Post content
  caption TEXT,
  hashtags TEXT[],

  -- Status
  status TEXT DEFAULT 'draft', -- draft, scheduled, posted, failed
  scheduled_for TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,

  -- Engagement
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_episodes_status ON episodes(status);
CREATE INDEX idx_episodes_air_date ON episodes(air_date);
CREATE INDEX idx_episodes_search ON episodes USING GIN(search_vector);
CREATE INDEX idx_guests_search ON guests USING GIN(search_vector);
CREATE INDEX idx_segments_episode ON segments(episode_id);
CREATE INDEX idx_analytics_episode ON analytics(episode_id);
CREATE INDEX idx_social_posts_episode ON social_posts(episode_id);
CREATE INDEX idx_social_posts_status ON social_posts(status);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER episodes_updated_at BEFORE UPDATE ON episodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER guests_updated_at BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER segments_updated_at BEFORE UPDATE ON segments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER social_posts_updated_at BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- Public read access (for slideshow app)
CREATE POLICY "Public can read episodes" ON episodes
  FOR SELECT USING (true);

CREATE POLICY "Public can read guests" ON guests
  FOR SELECT USING (true);

CREATE POLICY "Public can read segments" ON segments
  FOR SELECT USING (true);

-- Authenticated users can insert/update (for n8n workflows with service key)
CREATE POLICY "Authenticated can insert episodes" ON episodes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update episodes" ON episodes
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert guests" ON guests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update guests" ON guests
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert segments" ON segments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update segments" ON segments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert analytics" ON analytics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert social posts" ON social_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update social posts" ON social_posts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Helper function to get full episode data (with segments and guests)
CREATE OR REPLACE FUNCTION get_episode_full(episode_num INTEGER)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'EPISODE_NUMBER', e.episode_number,
    'EPISODE_TITLE', e.title,
    'AIR_DATE', e.air_date,
    'HOST', e.host,
    'STATUS', e.status,
    'QR_CODE_URL', e.qr_code_url,
    'QR_CODE_MESSAGE', e.qr_code_message,
    'HIGHLEVEL_QR_URL', e.highlevel_qr_url,
    'YOUTUBE_DESCRIPTION', e.youtube_description,
    'segments', (
      SELECT json_agg(
        json_build_object(
          'segment_number', s.segment_number,
          'segment_type', s.segment_type,
          'guest', (SELECT row_to_json(g.*) FROM guests g WHERE g.id = s.guest_id),
          'discussion_topics', s.discussion_topics,
          'discussion_guide', s.discussion_guide,
          'slides', s.slides
        ) ORDER BY s.segment_number
      )
      FROM segments s
      WHERE s.episode_id = e.id
    )
  ) INTO result
  FROM episodes e
  WHERE e.episode_number = episode_num;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anon users (for API calls)
GRANT EXECUTE ON FUNCTION get_episode_full(INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_episode_full(INTEGER) TO authenticated;

COMMENT ON TABLE episodes IS 'TattooNOW Weekly Show episodes';
COMMENT ON TABLE guests IS 'Guest artists and interviewees';
COMMENT ON TABLE segments IS 'Episode segments (interview or education)';
COMMENT ON TABLE analytics IS 'Episode analytics and metrics';
COMMENT ON TABLE social_posts IS 'Social media posts for episode promotion';
COMMENT ON FUNCTION get_episode_full IS 'Get complete episode data including segments and guests';
