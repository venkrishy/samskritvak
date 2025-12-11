-- Admin Content Tables Migration
-- Creates course_categories, courses, tutors, and homepage_content tables

-- Course Categories
CREATE TABLE IF NOT EXISTS public.course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_emoji TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.course_categories(id) ON DELETE SET NULL,
  description TEXT,
  icon_emoji TEXT,
  image_url TEXT,
  tutor_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Tutors
CREATE TABLE IF NOT EXISTS public.tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  profile_photo_url TEXT,
  bio TEXT,
  languages_taught TEXT[],
  native_languages TEXT[],
  hourly_rate_usd DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_lessons_taught INTEGER DEFAULT 0,
  experience_years INTEGER DEFAULT 0,
  certifications JSONB,
  education TEXT,
  specializations TEXT[],
  video_intro_url TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage Content
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type TEXT NOT NULL,
  content_json JSONB NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_active ON public.courses(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_tutors_active ON public.tutors(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_content_type ON public.homepage_content(section_type, is_active);

-- Enable RLS
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view active categories" ON public.course_categories 
  FOR SELECT USING (is_active = TRUE);
  
CREATE POLICY "Public can view active courses" ON public.courses 
  FOR SELECT USING (is_active = TRUE);
  
CREATE POLICY "Public can view active tutors" ON public.tutors 
  FOR SELECT USING (is_active = TRUE);
  
CREATE POLICY "Public can view active homepage content" ON public.homepage_content 
  FOR SELECT USING (is_active = TRUE);

-- Admin manage policies
CREATE POLICY "Admin can manage categories" ON public.course_categories 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
  
CREATE POLICY "Admin can manage courses" ON public.courses 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
  
CREATE POLICY "Admin can manage tutors" ON public.tutors 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
  
CREATE POLICY "Admin can manage homepage" ON public.homepage_content 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Authenticated users can read all (for admin dashboard)
CREATE POLICY "Authenticated can read all categories" ON public.course_categories 
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Authenticated can read all courses" ON public.courses 
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Authenticated can read all tutors" ON public.tutors 
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Authenticated can read all homepage" ON public.homepage_content 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_course_categories_updated_at 
  BEFORE UPDATE ON public.course_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at 
  BEFORE UPDATE ON public.courses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutors_updated_at 
  BEFORE UPDATE ON public.tutors 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at 
  BEFORE UPDATE ON public.homepage_content 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed Data
-- Seed Categories
INSERT INTO public.course_categories (name, slug, icon_emoji, display_order) VALUES
('Languages', 'languages', '🗣️', 1),
('Culture & Heritage', 'culture', '🏛️', 2)
ON CONFLICT (slug) DO NOTHING;

-- Seed Courses
INSERT INTO public.courses (name, slug, category_id, icon_emoji, display_order) VALUES
('Sanskrit', 'sanskrit', (SELECT id FROM public.course_categories WHERE slug='languages'), '🕉️', 1),
('English', 'english', (SELECT id FROM public.course_categories WHERE slug='languages'), '🇬🇧', 2),
('Hindi', 'hindi', (SELECT id FROM public.course_categories WHERE slug='languages'), '🇮🇳', 3),
('Telugu', 'telugu', (SELECT id FROM public.course_categories WHERE slug='languages'), '🇮🇳', 4),
('Tamil', 'tamil', (SELECT id FROM public.course_categories WHERE slug='languages'), '🇮🇳', 5),
('Yoga', 'yoga', (SELECT id FROM public.course_categories WHERE slug='culture'), '🧘', 1),
('Indian History', 'indian-history', (SELECT id FROM public.course_categories WHERE slug='culture'), '🏛️', 2),
('Ayurveda', 'ayurveda', (SELECT id FROM public.course_categories WHERE slug='culture'), '🌿', 3),
('Ramayana', 'ramayana', (SELECT id FROM public.course_categories WHERE slug='culture'), '📖', 4),
('Mahabharatha', 'mahabharatha', (SELECT id FROM public.course_categories WHERE slug='culture'), '📚', 5)
ON CONFLICT (slug) DO NOTHING;
