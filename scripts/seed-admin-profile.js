import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please check your .env.local file for:')
  console.log('- VITE_SUPABASE_URL')
  console.log('- VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedAdminProfile() {
  console.log('🔍 Looking for user: venkrishy@gmail.com')
  
  try {
    // First, let's check if the user exists in auth.users
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', 'venkrishy@gmail.com')
      .single()

    if (authError) {
      console.log('⚠️  Could not find user in auth.users')
      console.log('This might be because:')
      console.log('1. The user hasn\'t signed up yet')
      console.log('2. You need to use the service role key instead of anon key')
      console.log('3. The user exists but with a different email')
      
      console.log('\n📝 Manual steps:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Go to Authentication > Users')
      console.log('3. Find or create user: venkrishy@gmail.com')
      console.log('4. Copy the user ID')
      console.log('5. Run the SQL script with the actual user ID')
      
      return
    }

    console.log('✅ Found user in auth.users:', authUsers)

    // Now insert/update the profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authUsers.id,
        email: 'venkrishy@gmail.com',
        full_name: 'Venky Admin',
        role: 'SITE_ADMIN',
        updated_at: new Date().toISOString()
      })
      .select()

    if (profileError) {
      console.error('❌ Error creating profile:', profileError)
      return
    }

    console.log('✅ Profile created/updated successfully:', profile)
    console.log('\n🎉 You can now access the admin panel at: http://localhost:3003/admin')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Alternative: Manual SQL approach
function generateManualSQL() {
  console.log('\n📝 Manual SQL approach:')
  console.log('1. Go to your Supabase SQL Editor')
  console.log('2. Run this query to find your user ID:')
  console.log('   SELECT id, email FROM auth.users WHERE email = \'venkrishy@gmail.com\';')
  console.log('3. Then run this SQL (replace USER_ID with the actual ID):')
  console.log(`
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'USER_ID_HERE', -- Replace with actual user ID
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
  `)
}

// Run the seeding
seedAdminProfile()
  .then(() => {
    console.log('\n🔄 If the automatic approach didn\'t work, try the manual approach:')
    generateManualSQL()
  })
  .catch(error => {
    console.error('❌ Seeding failed:', error)
    generateManualSQL()
  })
