-- Seed admin profile for venkrishy@gmail.com
-- This script creates a profile entry for the admin user

-- First, let's check if the user exists in auth.users
-- If not, we'll need to create them first

-- Insert profile for venkrishy@gmail.com with SITE_ADMIN role
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  -- You'll need to replace this with the actual user ID from auth.users
  -- You can find this by running: SELECT id FROM auth.users WHERE email = 'venkrishy@gmail.com';
  '00000000-0000-0000-0000-000000000000', -- PLACEHOLDER - REPLACE WITH ACTUAL USER ID
  'venkrishy@gmail.com',
  'Venky Admin',
  'SITE_ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Alternative: If you want to create a test user first
-- Uncomment the following lines if you need to create the user in auth.users first

/*
-- Create user in auth.users (if they don't exist)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'venkrishy@gmail.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
*/

-- Query to find the user ID (run this first to get the actual ID)
-- SELECT id, email FROM auth.users WHERE email = 'venkrishy@gmail.com';
