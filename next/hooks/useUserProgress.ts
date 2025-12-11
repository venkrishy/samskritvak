'use client'

import { useState, useEffect } from 'react'

interface UserProgress {
  chapter: number
  topic: string
  isCompleted: boolean
  lastAccessed: string
  timeSpent: number
}

interface DashboardStats {
  totalLessons: number
  completedLessons: number
  currentChapter: number
  currentTopic: string
  totalTimeSpent: number
  streakDays: number
  completionPercentage: number
}

interface ChapterProgress {
  chapterNumber: number
  chapterTitle: string
  completedTopics: number
  totalTopics: number
  progressPercentage: number
  lastAccessed: string | null
}

interface RecentActivity {
  activityType: string
  chapterNumber: number | null
  topicNumber: string | null
  createdAt: string
  metadata: any
}

interface DashboardData {
  stats: DashboardStats
  chapterProgress: ChapterProgress[]
  recentActivity: RecentActivity[]
  lastLesson: {
    chapter: number
    topic: string
  }
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [lastLesson, setLastLesson] = useState<{ chapter: number, topic: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    // Prevent infinite retry loops
    if (retryCount >= 3) {
      // Use simple fallback API
      try {
        const response = await fetch('/api/user/progress/simple')
        const data = await response.json()
        setProgress(data.progress || [])
        setLastLesson(data.lastLesson || null)
        setError(null)
      } catch (fallbackErr) {
        setError('Progress tracking unavailable')
      }
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/user/progress')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setProgress(data.progress || [])
      setLastLesson(data.lastLesson || null)
      setRetryCount(0) // Reset retry count on success
    } catch (err) {
      console.error('Error fetching progress:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setRetryCount(prev => prev + 1)
      
      // Auto-retry with exponential backoff
      if (retryCount < 2) {
        setTimeout(() => {
          fetchProgress()
        }, Math.pow(2, retryCount) * 1000) // 1s, 2s, 4s delays
      }
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (chapterNumber: number, topicNumber: string, isCompleted: boolean = false, timeSpent: number = 0) => {
    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterNumber,
          topicNumber,
          isCompleted,
          timeSpent
        })
      })

      if (!response.ok) {
        // Fallback to simple API
        await fetch('/api/user/progress/simple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chapterNumber,
            topicNumber,
            isCompleted,
            timeSpent
          })
        })
        return
      }

      // Refresh progress data
      await fetchProgress()
    } catch (err) {
      console.error('Error updating progress:', err)
      // Don't set error state for update failures to prevent UI issues
    }
  }

  return {
    progress,
    lastLesson,
    loading,
    error,
    updateProgress,
    refetch: fetchProgress
  }
}

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard
  }
}

export function useAccount() {
  const [accountData, setAccountData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAccount()
  }, [])

  const fetchAccount = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/account')
      
      if (!response.ok) {
        throw new Error('Failed to fetch account data')
      }
      
      const data = await response.json()
      setAccountData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const updateAccount = async (updates: any) => {
    try {
      const response = await fetch('/api/user/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update account')
      }

      const data = await response.json()
      setAccountData(prev => ({
        ...prev,
        preferences: data.preferences
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return {
    accountData,
    loading,
    error,
    updateAccount,
    refetch: fetchAccount
  }
}
