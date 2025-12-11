import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LessonProgressTracker({ chapterNumber, topicNumber }) {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProgress()
    } else {
      setLoading(false)
    }
  }, [user, chapterNumber, topicNumber])

  const loadProgress = async () => {
    try {
      setLoading(true)
      // TODO: Implement progress tracking with Supabase
      // For now, return mock data
      setProgress({
        currentChapter: chapterNumber,
        currentTopic: topicNumber,
        completedLessons: 0,
        totalLessons: 100,
        progressPercentage: 0
      })
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (!progress) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Your Progress</h3>
        <span className="text-xs text-gray-500">
          {progress.completedLessons} of {progress.totalLessons} lessons
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress.progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Chapter {progress.currentChapter} • Topic {progress.currentTopic}</span>
        <span>{Math.round(progress.progressPercentage)}% complete</span>
      </div>
    </div>
  )
}





