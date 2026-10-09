-- ============================================
-- STEVE MEZZO IMAGES - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GALLERY IMAGES TABLE
-- ============================================
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  alt_text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRICING PACKAGES TABLE
-- ============================================
CREATE TABLE pricing_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  duration TEXT,
  description TEXT,
  features JSONB DEFAULT '[]',
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AVAILABILITY TABLE
-- ============================================
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOCKED DATES TABLE
-- ============================================
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES pricing_packages(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  location TEXT,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS TABLE (extends auth.users)
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_gallery_category ON gallery_images(category_id);
CREATE INDEX idx_gallery_featured ON gallery_images(featured);
CREATE INDEX idx_gallery_sort ON gallery_images(sort_order);
CREATE INDEX idx_bookings_date ON bookings(session_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_availability_day ON availability(day_of_week);
CREATE INDEX idx_blocked_dates ON blocked_dates(blocked_date);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (active = true);

CREATE POLICY "Public can view gallery images"
  ON gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Public can view active pricing packages"
  ON pricing_packages FOR SELECT
  USING (active = true);

CREATE POLICY "Public can view availability"
  ON availability FOR SELECT
  USING (active = true);

CREATE POLICY "Public can view blocked dates"
  ON blocked_dates FOR SELECT
  USING (true);

CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Public insert for bookings
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Admin policies (full access for authenticated admin users)
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage gallery"
  ON gallery_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage pricing"
  ON pricing_packages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage availability"
  ON availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage blocked dates"
  ON blocked_dates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can view and manage bookings"
  ON bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can update own profile"
  ON admin_users FOR UPDATE
  USING (id = auth.uid());

-- ============================================
-- SEED DATA
-- ============================================

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Portraits', 'portraits', 'Professional portrait photography', 1),
  ('Weddings', 'weddings', 'Wedding and engagement photography', 2),
  ('Events', 'events', 'Corporate and private events', 3),
  ('Fashion', 'fashion', 'Fashion and editorial photography', 4),
  ('Branding', 'branding', 'Commercial branding photography', 5),
  ('Lifestyle', 'lifestyle', 'Lifestyle and documentary photography', 6);

-- Pricing Packages
INSERT INTO pricing_packages (name, slug, price, duration, description, features, sort_order, active) VALUES
  (
    'Extended Session',
    'extended-session',
    200.00,
    '1-2 hours',
    '35-50 edited photos',
    '["Professional editing", "Online gallery", "High-resolution downloads"]',
    1,
    true
  ),
  (
    'Half Day Event',
    'half-day-event',
    300.00,
    '3-4 hours',
    '75-100 edited photos',
    '["Professional editing", "Online gallery", "High-resolution downloads", "Same-day preview"]',
    2,
    true
  ),
  (
    'Full Day Event',
    'full-day-event',
    550.00,
    '6-8 hours',
    '150-200 edited photos',
    '["Professional editing", "Online gallery", "High-resolution downloads", "Same-day preview", "Second photographer"]',
    3,
    true
  );

-- Site Settings
INSERT INTO site_settings (key, value, description) VALUES
  ('business_hours', '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}}', 'Business operating hours'),
  ('booking_settings', '{"buffer_minutes": 30, "advance_booking_days": 60, "min_notice_hours": 24}', 'Booking system configuration'),
  ('contact_info', '{"email": "info@stevemezzoimages.com", "phone": "+1 469 558 3859", "location": "Texas, USA"}', 'Business contact information'),
  ('social_links', '{"instagram": "https://instagram.com/stevemezzoimages", "facebook": "https://facebook.com/stevemezzoimages", "tiktok": "https://tiktok.com/@stevemezzoimages"}', 'Social media links');

-- Availability (Monday-Friday, 9 AM - 5 PM)
INSERT INTO availability (day_of_week, start_time, end_time, active) VALUES
  (1, '09:00', '17:00', true),
  (2, '09:00', '17:00', true),
  (3, '09:00', '17:00', true),
  (4, '09:00', '17:00', true),
  (5, '09:00', '17:00', true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_packages_updated_at BEFORE UPDATE ON pricing_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
