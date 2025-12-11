import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase credentials are configured
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not configured. Using local images as fallback.')
  console.warn('Please create .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
)
