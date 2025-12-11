import { createMockSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/signin - Sign in user
export async function POST(request: NextRequest) {
  try {
    const session = createMockSession()
    
    return NextResponse.json({
      success: true,
      user: session.user,
      session: {
        expiresAt: session.expiresAt
      }
    })
  } catch (error) {
    console.error('Error in sign in:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}






