-- Add SITE_ADMIN role and currency management

-- Update profiles table to include SITE_ADMIN role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'SITE_ADMIN';

-- Create currencies table for dynamic currency management
CREATE TABLE IF NOT EXISTS public.currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- USD, EUR, INR, etc.
  name TEXT NOT NULL, -- US Dollar, Euro, Indian Rupee, etc.
  symbol TEXT NOT NULL, -- $, €, ₹, etc.
  flag_emoji TEXT, -- 🇺🇸, 🇪🇺, 🇮🇳, etc.
  exchange_rate DECIMAL(10, 4) DEFAULT 1.0000, -- Base rate against USD
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default currencies
INSERT INTO public.currencies (code, name, symbol, flag_emoji, exchange_rate, display_order) VALUES
('USD', 'US Dollar', '$', '🇺🇸', 1.0000, 1),
('EUR', 'Euro', '€', '🇪🇺', 0.9200, 2),
('GBP', 'British Pound', '£', '🇬🇧', 0.7900, 3),
('INR', 'Indian Rupee', '₹', '🇮🇳', 83.0000, 4),
('BRL', 'Brazilian Real', 'R$', '🇧🇷', 4.9600, 5),
('PLN', 'Polish Zloty', 'zł', '🇵🇱', 3.9600, 6),
('UAH', 'Ukrainian Hryvnia', '₴', '🇺🇦', 36.5000, 7)
ON CONFLICT (code) DO NOTHING;

-- Enable RLS on currencies table
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for currencies
-- Public can view active currencies
CREATE POLICY "Public can view active currencies" ON public.currencies 
  FOR SELECT USING (is_active = TRUE);

-- SITE_ADMIN can manage all currencies
CREATE POLICY "SITE_ADMIN can manage currencies" ON public.currencies 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'SITE_ADMIN'
    )
  );

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_currencies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_currencies_updated_at 
  BEFORE UPDATE ON public.currencies 
  FOR EACH ROW EXECUTE FUNCTION update_currencies_updated_at();

-- Create admin sessions table for tracking admin activity
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Only SITE_ADMIN can view their own sessions
CREATE POLICY "SITE_ADMIN can view own sessions" ON public.admin_sessions 
  FOR SELECT USING (
    user_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'SITE_ADMIN'
    )
  );

-- Only SITE_ADMIN can create sessions
CREATE POLICY "SITE_ADMIN can create sessions" ON public.admin_sessions 
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'SITE_ADMIN'
    )
  );

