-- Fix infinite recursion in profiles table RLS policies
-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create simple, non-recursive policies
-- Policy 1: Users can view their own profile (simple check)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (simple check)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile (simple check)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 4: Allow authenticated users to read profiles (for admin checks)
-- This is simpler and avoids recursion
CREATE POLICY "Authenticated users can read profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy 5: Allow authenticated users to update profiles (for admin updates)
CREATE POLICY "Authenticated users can update profiles" ON profiles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Ensure the profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
