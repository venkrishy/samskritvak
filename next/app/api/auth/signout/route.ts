import { clearSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/signout - Sign out user
export async function POST(request: NextRequest) {
  try {
    clearSession()
    
    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Error in sign out:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}






