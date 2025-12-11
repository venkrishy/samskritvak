import { createServerClient } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/user/account - Get user account information
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (prefsError && prefsError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user preferences:', prefsError)
      return NextResponse.json({ error: 'Failed to fetch user preferences' }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: preferences?.display_name || user.user_metadata?.name || user.email?.split('@')[0],
        avatarUrl: user.user_metadata?.avatar_url,
        createdAt: user.created_at
      },
      preferences: preferences || {
        display_name: user.user_metadata?.name || user.email?.split('@')[0],
        preferred_language: 'en',
        notifications_enabled: true,
        email_notifications: true,
        progress_reminders: true,
        theme_preference: 'light'
      }
    })

  } catch (error) {
    console.error('Error in GET /api/user/account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/user/account - Update user account information
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { displayName, preferredLanguage, notificationsEnabled, emailNotifications, progressReminders, themePreference } = body

    // Update user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        display_name: displayName,
        preferred_language: preferredLanguage,
        notifications_enabled: notificationsEnabled,
        email_notifications: emailNotifications,
        progress_reminders: progressReminders,
        theme_preference: themePreference,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (prefsError) {
      console.error('Error updating user preferences:', prefsError)
      return NextResponse.json({ error: 'Failed to update user preferences' }, { status: 500 })
    }

    // Log activity
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'profile_updated',
        metadata: {
          updated_fields: Object.keys(body)
        }
      })

    return NextResponse.json({ 
      success: true, 
      preferences: preferences 
    })

  } catch (error) {
    console.error('Error in PUT /api/user/account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

