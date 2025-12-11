import { NextRequest, NextResponse } from 'next/server'

// Simple fallback API that doesn't depend on Supabase
// This prevents infinite error loops when Supabase is not available

export async function GET(request: NextRequest) {
  try {
    // Return mock data to prevent errors
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
    console.error('Error in simple progress API:', error)
    return NextResponse.json({ 
      progress: [], 
      lastLesson: { chapter: 1, topic: '1.1' },
      currentChapter: 1,
      currentTopic: '1.1'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Just return success without doing anything
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in simple progress POST:', error)
    return NextResponse.json({ success: true })
  }
}






