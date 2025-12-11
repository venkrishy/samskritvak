// Simple authentication system for development
// This provides mock authentication without requiring Supabase setup

export interface User {
  id: string
  email: string
  displayName: string
  role: 'student' | 'teacher' | 'admin'
}

export interface Session {
  user: User
  expiresAt: number
}

// Mock user data
const MOCK_USER: User = {
  id: 'mock-user-123',
  email: 'venkrishy@gmail.com',
  displayName: 'Venky Krishnaswamy',
  role: 'student'
}

// Simple in-memory session storage (for development only)
let currentSession: Session | null = null

export function createMockSession(): Session {
  const session: Session = {
    user: MOCK_USER,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  currentSession = session
  return session
}

export function getCurrentSession(): Session | null {
  if (!currentSession) {
    return null
  }
  
  // Check if session is expired
  if (Date.now() > currentSession.expiresAt) {
    currentSession = null
    return null
  }
  
  return currentSession
}

export function clearSession(): void {
  currentSession = null
}

export function isAuthenticated(): boolean {
  return getCurrentSession() !== null
}

export function getCurrentUser(): User | null {
  const session = getCurrentSession()
  return session?.user || null
}






