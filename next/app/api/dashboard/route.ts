import { createServerClient } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/dashboard - Get dashboard statistics and data
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
      stats: {
        totalLessons: 20,
        completedLessons: 5,
        currentChapter: 1,
        currentTopic: '1.1',
        totalTimeSpent: 120,
        streakDays: 3,
        completionPercentage: 25
      },
      chapterProgress: [
        {
          chapterNumber: 1,
          chapterTitle: "Hello! Getting Started",
          completedTopics: 2,
          totalTopics: 6,
          progressPercentage: 33,
          lastAccessed: new Date().toISOString()
        },
        {
          chapterNumber: 2,
          chapterTitle: "Naming Things & Asking 'Is It There?'",
          completedTopics: 0,
          totalTopics: 5,
          progressPercentage: 0,
          lastAccessed: null
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'lesson_completed',
          title: '1.1 - Greetings and Identity',
          timestamp: new Date().toISOString()
        }
      ],
      lastLesson: {
        chapter: 1,
        topic: '1.1'
      }
    })

  } catch (error) {
    console.error('Error in GET /api/dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
