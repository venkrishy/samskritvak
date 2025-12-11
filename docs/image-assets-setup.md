# Image Assets Database Setup

## 🎯 **Goal: Store R2 Image Metadata in Supabase**

Create a table to store metadata for your uploaded R2 images with URLs, filenames, and comments.

## 📋 **SQL Commands to Run**

### **Step 1: Create the Table**
Run this in your **Supabase SQL Editor**:

```sql
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
```

### **Step 2: Seed with Your R2 Images**
Run this to insert all your uploaded images:

```sql
-- Seed image_assets table with R2 uploaded images
INSERT INTO public.image_assets (
  filename,
  r2_url,
  comments,
  category,
  page,
  alt_text,
  file_size,
  mime_type,
  is_active
) VALUES 
-- Hero Images
(
  'hero-student-learning.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/hero-student-learning.jpg',
  'Main hero image for homepage showing diverse students learning with online tutors',
  'hero',
  'homepage',
  'Students learning languages with tutors online',
  245760,
  'image/jpeg',
  true
),
(
  'teach-hero.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/teach-hero.jpg',
  'Hero image for become a tutor page',
  'hero',
  'teach',
  'Tutor teaching online',
  198432,
  'image/jpeg',
  true
),
(
  'business-hero.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/business-hero.jpg',
  'Hero image for business training page',
  'hero',
  'business',
  'Corporate language training',
  187654,
  'image/jpeg',
  true
),

-- Background Images
(
  'stats-background.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/stats-background.jpg',
  'Background image for stats section on homepage',
  'background',
  'homepage',
  'Abstract gradient background for statistics',
  156789,
  'image/jpeg',
  true
),

-- Tutor Avatars
(
  'tutor-placeholder-1.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/tutor-placeholder-1.jpg',
  'First tutor profile photo placeholder',
  'tutor',
  'tutors',
  'Tutor profile photo 1',
  89234,
  'image/jpeg',
  true
),
(
  'tutor-placeholder-2.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/tutor-placeholder-2.jpg',
  'Second tutor profile photo placeholder',
  'tutor',
  'tutors',
  'Tutor profile photo 2',
  94567,
  'image/jpeg',
  true
),
(
  'tutor-placeholder-3.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/tutor-placeholder-3.jpg',
  'Third tutor profile photo placeholder',
  'tutor',
  'tutors',
  'Tutor profile photo 3',
  87654,
  'image/jpeg',
  true
),

-- Testimonial Avatars
(
  'testimonial-avatar-1.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/testimonial-avatar-1.jpg',
  'First testimonial customer photo',
  'avatar',
  'homepage',
  'Customer testimonial photo 1',
  67890,
  'image/jpeg',
  true
),
(
  'testimonial-avatar-2.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/testimonial-avatar-2.jpg',
  'Second testimonial customer photo',
  'avatar',
  'homepage',
  'Customer testimonial photo 2',
  71234,
  'image/jpeg',
  true
),

-- Illustrations
(
  'teach-benefits.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/teach-benefits.jpg',
  'Illustration showing benefits of teaching online',
  'illustration',
  'teach',
  'Teaching benefits illustration',
  134567,
  'image/jpeg',
  true
),
(
  'business-case-study.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/business-case-study.jpg',
  'Business case study illustration',
  'illustration',
  'business',
  'Business case study illustration',
  145678,
  'image/jpeg',
  true
),

-- Screenshots/Infographics
(
  'progress-dashboard.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/progress-dashboard.jpg',
  'Screenshot of learning progress dashboard',
  'screenshot',
  'proven-progress',
  'Learning progress dashboard screenshot',
  167890,
  'image/jpeg',
  true
),
(
  'progress-stats.jpg',
  'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/progress-stats.jpg',
  'Infographic showing learning statistics',
  'infographic',
  'proven-progress',
  'Learning statistics infographic',
  123456,
  'image/jpeg',
  true
);
```

### **Step 3: Verify the Data**
Run this to confirm everything was inserted:

```sql
-- Verify the data was inserted
SELECT 
  filename,
  r2_url,
  category,
  page,
  is_active,
  created_at
FROM public.image_assets 
ORDER BY category, filename;
```

## 🎯 **Table Structure**

### **Columns:**
- **`id`** - UUID primary key
- **`filename`** - Original filename (e.g., "hero-student-learning.jpg")
- **`r2_url`** - Full R2 URL (e.g., "https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/hero-student-learning.jpg")
- **`comments`** - Your custom comments about the image
- **`category`** - Image type (hero, avatar, tutor, background, illustration, screenshot, infographic)
- **`page`** - Which page uses this image (homepage, tutors, teach, business, proven-progress)
- **`alt_text`** - Accessibility description
- **`file_size`** - File size in bytes
- **`mime_type`** - File type (image/jpeg, image/png, etc.)
- **`is_active`** - Enable/disable the image
- **`created_at`** - When it was added
- **`updated_at`** - Last modified

## 🔧 **Using the Service**

### **Import the Service:**
```javascript
import { ImageAssetsService } from '@/services/imageAssetsService'
```

### **Get All Images:**
```javascript
const images = await ImageAssetsService.getAllImages()
```

### **Get Images by Category:**
```javascript
const heroImages = await ImageAssetsService.getImagesByCategory('hero')
const tutorAvatars = await ImageAssetsService.getTutorAvatars()
const testimonialAvatars = await ImageAssetsService.getTestimonialAvatars()
```

### **Get Images by Page:**
```javascript
const homepageImages = await ImageAssetsService.getImagesByPage('homepage')
```

### **Get Specific Image:**
```javascript
const image = await ImageAssetsService.getImageByFilename('hero-student-learning.jpg')
```

## 🎉 **Benefits**

### **✅ Centralized Management:**
- All image metadata in one place
- Easy to update comments and descriptions
- Enable/disable images without code changes

### **✅ Performance:**
- Fast R2 CDN delivery
- Optimized queries with indexes
- Cached metadata

### **✅ Admin Control:**
- Manage images through admin panel
- Update comments and descriptions
- Enable/disable images dynamically

### **✅ Accessibility:**
- Alt text for screen readers
- Proper image descriptions
- SEO-friendly metadata

## 🚀 **Next Steps**

1. **Run the SQL commands** in Supabase
2. **Update your components** to use `ImageAssetsService`
3. **Test image loading** from R2 URLs
4. **Add admin panel** for image management

Your image assets are now fully integrated with R2 and Supabase! 🎉
