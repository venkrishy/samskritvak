-- Admin Profile Setup for venkrishy@gmail.com
-- Run this in your Supabase SQL Editor

-- Step 1: Find your user ID (run this first)
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'venkrishy@gmail.com';

-- Step 2: If the user exists, copy the ID and run this:
-- (Replace 'YOUR_USER_ID_HERE' with the actual ID from Step 1)

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual user ID from Step 1
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

-- Step 3: Verify the profile was created
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
WHERE email = 'venkrishy@gmail.com';

-- Alternative: If you need to create the user first
-- (Only run this if the user doesn't exist in auth.users)

/*
-- Create user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
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
