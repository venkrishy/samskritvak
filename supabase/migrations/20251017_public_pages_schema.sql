-- Public Pages Database Schema
-- This migration adds tables needed for Preply-style public pages

-- Tutors Table - Store tutor profiles and information
CREATE TABLE public.tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profile_photo_url TEXT,
  intro_video_url TEXT,
  bio TEXT,
  languages_taught TEXT[] NOT NULL, -- e.g., ['Sanskrit', 'Hindi']
  native_languages TEXT[],
  hourly_rate_usd DECIMAL(10,2) NOT NULL,
  experience_years INT DEFAULT 0,
  teaching_style TEXT,
  availability_json JSONB, -- Flexible schedule storage
  certifications TEXT[],
  education TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'inactive')),
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INT DEFAULT 0,
  total_lessons_taught INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor Reviews Table - Reviews and ratings for tutors
CREATE TABLE public.tutor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tutor_id, student_id)
);

-- Contact Inquiries Table - Form submissions from public pages
CREATE TABLE public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('general', 'business', 'tutor', 'support')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  number_of_learners INT,
  message TEXT NOT NULL,
  preferred_language TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  assigned_to UUID REFERENCES public.profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor Applications Table - Track tutor signup form submissions
CREATE TABLE public.tutor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  languages_to_teach TEXT[] NOT NULL,
  native_languages TEXT[],
  teaching_experience_years INT,
  education TEXT,
  certifications TEXT,
  why_teach TEXT,
  profile_photo_url TEXT,
  intro_video_url TEXT,
  availability_json JSONB,
  desired_hourly_rate DECIMAL(10,2),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Leads Table - Corporate training inquiries
CREATE TABLE public.business_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  number_of_employees INT,
  languages_interested TEXT[],
  training_goals TEXT,
  budget_range TEXT,
  start_timeline TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'demo_scheduled', 'proposal_sent', 'negotiation', 'won', 'lost')),
  assigned_to UUID REFERENCES public.profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Currencies Table - Supported currencies for pricing
CREATE TABLE public.currencies (
  code TEXT PRIMARY KEY, -- USD, EUR, GBP, etc.
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  exchange_rate_to_usd DECIMAL(10,6) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial currencies
INSERT INTO public.currencies (code, name, symbol, exchange_rate_to_usd) VALUES
  ('USD', 'US Dollar', '$', 1.0),
  ('EUR', 'Euro', '€', 0.92),
  ('GBP', 'British Pound', '£', 0.79),
  ('BRL', 'Brazilian Real', 'R$', 4.96),
  ('PLN', 'Polish Zloty', 'zł', 3.96),
  ('UAH', 'Ukrainian Hryvnia', '₴', 36.5);

-- Indexes for Performance
CREATE INDEX idx_tutors_user_id ON public.tutors(user_id);
CREATE INDEX idx_tutors_status ON public.tutors(status);
CREATE INDEX idx_tutors_languages ON public.tutors USING GIN(languages_taught);
CREATE INDEX idx_tutors_rating ON public.tutors(rating DESC);
CREATE INDEX idx_tutor_reviews_tutor_id ON public.tutor_reviews(tutor_id);
CREATE INDEX idx_contact_inquiries_type ON public.contact_inquiries(inquiry_type);
CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX idx_tutor_applications_status ON public.tutor_applications(status);
CREATE INDEX idx_business_leads_status ON public.business_leads(status);

-- Enable Row Level Security
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Tutors: Public read for approved tutors
CREATE POLICY tutors_public_read ON public.tutors 
  FOR SELECT USING (status = 'approved' OR status = 'active');

-- Contact inquiries: Anyone can insert, admins can manage
CREATE POLICY contact_inquiries_insert ON public.contact_inquiries 
  FOR INSERT WITH CHECK (true);

-- Tutor applications: Users can create, admins can view/manage
CREATE POLICY tutor_applications_insert ON public.tutor_applications 
  FOR INSERT WITH CHECK (true);

-- Business leads: Anyone can insert, admins can manage
CREATE POLICY business_leads_insert ON public.business_leads 
  FOR INSERT WITH CHECK (true);

-- Currencies: Public read
CREATE POLICY currencies_public_read ON public.currencies 
  FOR SELECT USING (is_active = true);

