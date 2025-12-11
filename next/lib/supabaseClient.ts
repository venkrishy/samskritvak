import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable persistent sessions - user stays logged in until explicit logout
    persistSession: true,
    // Auto refresh tokens to maintain session
    autoRefreshToken: true,
    // Detect session in URL (for OAuth redirects)
    detectSessionInUrl: true,
    // Store session in localStorage for persistence across browser sessions
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Flow type for OAuth
    flowType: 'pkce'
  }
})






