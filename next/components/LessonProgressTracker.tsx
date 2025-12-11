'use client'

import { useEffect, useState } from 'react'
import { useUserProgress } from '@/hooks/useUserProgress'

interface LessonProgressTrackerProps {
  chapterNumber: number
  topicNumber: string
}

export function LessonProgressTracker({ chapterNumber, topicNumber }: LessonProgressTrackerProps) {
  const { updateProgress } = useUserProgress()
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    // Start tracking time when component mounts
    const start = Date.now()
    setStartTime(start)

    // Only update progress once on mount
    if (!hasInitialized) {
      updateProgress(chapterNumber, topicNumber, false, 0)
      setHasInitialized(true)
    }

    // Track time spent
    const interval = setInterval(() => {
      if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setTimeSpent(elapsed)
      }
    }, 1000)

    // Cleanup on unmount
    return () => {
      clearInterval(interval)
      if (startTime) {
        const finalTime = Math.floor((Date.now() - startTime) / 1000)
        updateProgress(chapterNumber, topicNumber, isCompleted, finalTime)
      }
    }
  }, [chapterNumber, topicNumber, updateProgress, startTime, isCompleted, hasInitialized])

  const handleMarkComplete = () => {
    setIsCompleted(true)
    updateProgress(chapterNumber, topicNumber, true, timeSpent)
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700">Tracking progress</span>
          </div>
          <div className="text-sm text-blue-600">
            Time spent: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        {!isCompleted && (
          <button
            onClick={handleMarkComplete}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Mark as Complete
          </button>
        )}
        
        {isCompleted && (
          <div className="flex items-center space-x-2 text-green-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </div>
    </div>
  )
}
