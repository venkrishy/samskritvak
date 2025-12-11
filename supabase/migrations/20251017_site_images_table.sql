-- Create site_images table for storing image metadata
CREATE TABLE IF NOT EXISTS public.site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- hero, avatar, tutor, background, illustration, etc.
  page TEXT NOT NULL DEFAULT 'general', -- homepage, tutors, teach, business, etc.
  alt_text TEXT,
  description TEXT,
  file_size INTEGER,
  mime_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_images_category ON public.site_images(category);
CREATE INDEX IF NOT EXISTS idx_site_images_page ON public.site_images(page);
CREATE INDEX IF NOT EXISTS idx_site_images_is_active ON public.site_images(is_active);
CREATE INDEX IF NOT EXISTS idx_site_images_filename ON public.site_images(filename);

-- Enable RLS
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read all active images
CREATE POLICY "Public can view active images" ON public.site_images 
  FOR SELECT USING (is_active = TRUE);

-- Admins can manage all images
CREATE POLICY "Admins can manage site images" ON public.site_images 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can view all images (for admin panel)
CREATE POLICY "Authenticated users can view all images" ON public.site_images 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_images_updated_at 
  BEFORE UPDATE ON public.site_images 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

