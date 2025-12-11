'use client'

import { useState } from 'react'

interface ProgressFallbackProps {
  chapterNumber: number
  topicNumber: string
}

export function ProgressFallback({ chapterNumber, topicNumber }: ProgressFallbackProps) {
  const [isCompleted, setIsCompleted] = useState(false)

  const handleMarkComplete = () => {
    setIsCompleted(true)
    // Store completion in localStorage as fallback
    const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]')
    if (!completed.includes(`${chapterNumber}-${topicNumber}`)) {
      completed.push(`${chapterNumber}-${topicNumber}`)
      localStorage.setItem('completedLessons', JSON.stringify(completed))
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-blue-700">Progress tracking (offline mode)</span>
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






