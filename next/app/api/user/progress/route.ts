import { createServerClient } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/user/progress - Get user's current progress and last lesson
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return mock data for authenticated user
    return NextResponse.json({
      progress: [],
      lastLesson: {
        chapter: 1,
        topic: '1.1'
      },
      currentChapter: 1,
      currentTopic: '1.1'
    })

  } catch (error) {
    console.error('Error in GET /api/user/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/user/progress - Update user progress
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { chapterNumber, topicNumber, isCompleted = false, timeSpent = 0 } = body

    // For now, just return success (mock implementation)
    // TODO: Implement actual database updates later
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in POST /api/user/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
