-- Create image_assets table for storing R2 image metadata
CREATE TABLE IF NOT EXISTS public.image_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  r2_url TEXT NOT NULL UNIQUE,
  comments TEXT,
  category TEXT, -- hero, avatar, tutor, background, illustration, etc.
  page TEXT, -- homepage, tutors, teach, business, etc.
  alt_text TEXT, -- For accessibility
  file_size INTEGER, -- File size in bytes
  mime_type TEXT, -- image/jpeg, image/png, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on image_assets table
ALTER TABLE public.image_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for image_assets
-- Public can view active images
CREATE POLICY "Public can view active image assets" ON public.image_assets 
  FOR SELECT USING (is_active = TRUE);

-- SITE_ADMIN can manage all image assets
CREATE POLICY "SITE_ADMIN can manage image assets" ON public.image_assets 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'SITE_ADMIN'
    )
  );

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_image_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_image_assets_updated_at 
  BEFORE UPDATE ON public.image_assets 
  FOR EACH ROW EXECUTE FUNCTION update_image_assets_updated_at();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_image_assets_category ON public.image_assets(category);
CREATE INDEX IF NOT EXISTS idx_image_assets_page ON public.image_assets(page);
CREATE INDEX IF NOT EXISTS idx_image_assets_active ON public.image_assets(is_active);
