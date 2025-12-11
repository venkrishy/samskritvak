-- Seed image_assets table with R2 uploaded images
-- Based on successful upload results

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
