-- =====================================================
-- DJ Photography - Supabase Database Setup
-- =====================================================

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  price_note TEXT DEFAULT 'Starting price',
  badge TEXT,
  popular BOOLEAN DEFAULT FALSE,
  accent_color TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREATE POLICIES
-- =====================================================

-- Events policies
CREATE POLICY "Events are viewable by everyone" 
ON events FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Events are insertable by authenticated users" 
ON events FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Events are updatable by authenticated users" 
ON events FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Events are deletable by authenticated users" 
ON events FOR DELETE 
TO authenticated 
USING (true);

-- Gallery images policies
CREATE POLICY "Gallery images are viewable by everyone" 
ON gallery_images FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Gallery images are insertable by authenticated users" 
ON gallery_images FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Gallery images are updatable by authenticated users" 
ON gallery_images FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Gallery images are deletable by authenticated users" 
ON gallery_images FOR DELETE 
TO authenticated 
USING (true);

-- Packages policies
CREATE POLICY "Packages are viewable by everyone" 
ON packages FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Packages are insertable by authenticated users" 
ON packages FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Packages are updatable by authenticated users" 
ON packages FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Packages are deletable by authenticated users" 
ON packages FOR DELETE 
TO authenticated 
USING (true);

-- Site settings policies
CREATE POLICY "Site settings are viewable by everyone"
ON site_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Site settings are insertable by authenticated users"
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Site settings are updatable by authenticated users"
ON site_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Site settings are deletable by authenticated users"
ON site_settings FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- 4. CREATE STORAGE BUCKET
-- =====================================================

-- Note: Create the "gallery" bucket manually in Supabase Dashboard
-- Set it as a PUBLIC bucket for easy image access

-- =====================================================
-- 5. INSERT DEFAULT PACKAGES
-- =====================================================

INSERT INTO packages (name, price, badge, popular, accent_color, features) VALUES
('Silver', 70000, NULL, false, 'from-slate-400 to-slate-300', '[
  {"text": "1 Day Photography Coverage", "included": true},
  {"text": "400+ Edited Photos", "included": true},
  {"text": "Online Gallery Access", "included": true},
  {"text": "1 Photographer", "included": true},
  {"text": "USB Drive Delivery", "included": true},
  {"text": "Cinematic Video", "included": false},
  {"text": "Pre-Wedding Shoot", "included": false},
  {"text": "Same Day Edit (Highlights)", "included": false},
  {"text": "Printed Album", "included": false},
  {"text": "Drone Shots", "included": false}
]'::jsonb),

('Gold', 95000, 'Most Popular', true, 'from-gold-500 to-gold-400', '[
  {"text": "2 Day Photography Coverage", "included": true},
  {"text": "700+ Edited Photos", "included": true},
  {"text": "Online Gallery Access", "included": true},
  {"text": "2 Photographers", "included": true},
  {"text": "USB Drive + Cloud Delivery", "included": true},
  {"text": "Cinematic Wedding Film (5 min)", "included": true},
  {"text": "Pre-Wedding Shoot (1 hour)", "included": true},
  {"text": "Same Day Edit (Highlights)", "included": false},
  {"text": "Printed Album (20 pages)", "included": false},
  {"text": "Drone Shots", "included": false}
]'::jsonb),

('Diamond', 120000, 'Best Value', false, 'from-cyan-400 to-blue-400', '[
  {"text": "3 Day Photography Coverage", "included": true},
  {"text": "1000+ Edited Photos", "included": true},
  {"text": "Online Gallery Access", "included": true},
  {"text": "3 Photographers", "included": true},
  {"text": "USB Drive + Cloud + Print Delivery", "included": true},
  {"text": "Cinematic Wedding Film (10 min)", "included": true},
  {"text": "Pre-Wedding Shoot (2 hours)", "included": true},
  {"text": "Same Day Edit (Highlights)", "included": true},
  {"text": "Printed Album (40 pages)", "included": true},
  {"text": "Drone Shots", "included": false}
]'::jsonb),

('Platinum', 170000, NULL, false, 'from-maroon-700 to-maroon-500', '[
  {"text": "Full Event Photography Coverage", "included": true},
  {"text": "1500+ Edited Photos", "included": true},
  {"text": "Premium Online Gallery", "included": true},
  {"text": "4 Photographers + 2 Videographers", "included": true},
  {"text": "All Formats Delivery", "included": true},
  {"text": "Cinematic Wedding Film (20 min)", "included": true},
  {"text": "Pre-Wedding Shoot (Full Day)", "included": true},
  {"text": "Same Day Edit (Highlights)", "included": true},
  {"text": "Premium Printed Album (60 pages)", "included": true},
  {"text": "Drone Shots (Aerial Footage)", "included": true}
]'::jsonb);

-- =====================================================
-- 6. CREATE HELPER FUNCTIONS
-- =====================================================

-- Create function to generate slug from event name
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(input_text, '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_event_id ON gallery_images(event_id);
CREATE INDEX IF NOT EXISTS idx_packages_price ON packages(price);
