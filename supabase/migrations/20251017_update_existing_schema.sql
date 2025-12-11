-- Update existing tables for public pages support

-- Update profiles table to add tutor_id reference and preferences
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tutor_id UUID REFERENCES public.tutors(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'USD';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Add language column to curriculum if not generic
ALTER TABLE public.curriculum ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'sanskrit';
CREATE INDEX IF NOT EXISTS idx_curriculum_language ON public.curriculum(language);

