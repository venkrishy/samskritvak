# Admin Database Setup Guide

## Overview
This guide walks you through setting up the database tables for the admin system.

## Step 1: Run Currencies Migration

Go to your **Supabase Dashboard** → **SQL Editor** and run this migration:

**File:** `supabase/migrations/20251018_currencies_fixed.sql`

This creates the `currencies` table with proper RLS policies and seeds initial currency data.

## Step 2: Run Admin Content Tables Migration

In the same SQL Editor, run this migration:

**File:** `supabase/migrations/20251018_admin_content_tables.sql`

This creates:
- `course_categories` table
- `courses` table  
- `tutors` table
- `homepage_content` table

Plus RLS policies and seed data for courses.

## Step 3: Verify Tables

After running both migrations, verify in Supabase that these tables exist:
- ✅ currencies
- ✅ course_categories
- ✅ courses
- ✅ tutors
- ✅ homepage_content

## Step 4: Test in Admin Dashboard

1. Go to `http://localhost:3000/admin`
2. Log in with your admin account
3. Navigate to the Currencies tab
4. You should see the seeded currencies (USD, EUR, GBP, INR, etc.)

## What Gets Seeded

### Currencies
- USD, EUR, GBP, INR, BRL, PLN, UAH with exchange rates

### Course Categories
- Languages
- Culture & Heritage

### Courses
**Languages:**
- Sanskrit, English, Hindi, Telugu, Tamil

**Culture & Heritage:**
- Yoga, Indian History, Ayurveda, Ramayana, Mahabharatha

## Troubleshooting

### Error: "relation already exists"
- This means the table was already created. You can skip that migration or drop the table first.

### Error: "permission denied"
- Make sure your user has the `admin` role in the `profiles` table.

### Error: "infinite recursion"
- The RLS policies are properly configured to avoid this. If you see this, run the fix from earlier:
  ```sql
  ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
  -- (recreate simple policies)
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ```

## Next Steps

After the database is set up:
1. The admin dashboard will load currencies from the database
2. The homepage will load courses from the database
3. Admins can add/edit/delete content without code changes
