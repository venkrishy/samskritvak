import { notFound } from 'next/navigation'
import { 
  getTopicData, 
  getNextTopic, 
  getPreviousTopic, 
  getNextChapter, 
  getPreviousChapter 
} from '@/lib/curriculumData'
import { LessonProgressTracker } from '@/components/LessonProgressTracker'
import { ProgressFallback } from '@/components/ProgressFallback'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface LessonPageProps {
  params: {
    chapter: string
    topic: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  // Await params in Next.js 15
  const { chapter, topic } = await params
  const chapterNumber = parseInt(chapter)
  
  // Get lesson data from our curriculum data
  const lesson = getTopicData(chapterNumber, topic)
  
  if (!lesson) {
    notFound()
  }

  // Calculate navigation
  const nextTopicData = getNextTopic(chapterNumber, topic)
  const prevTopicData = getPreviousTopic(chapterNumber, topic)
  const nextChapter = getNextChapter(chapterNumber)
  const prevChapter = getPreviousChapter(chapterNumber)

  return (
    <div className="space-y-6">
      {/* Progress Tracker with Error Boundary */}
      <ErrorBoundary 
        fallback={
          <ProgressFallback 
            chapterNumber={chapterNumber} 
            topicNumber={topic} 
          />
        }
      >
        <LessonProgressTracker 
          chapterNumber={chapterNumber} 
          topicNumber={topic} 
        />
      </ErrorBoundary>
      
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-green-800">{lesson.title}</h1>
            <p className="text-green-600 mt-1">{lesson.description}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Level Beginner
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {prevTopicData ? (
              <a 
                href={`/chapters/${prevTopicData.chapter}/topics/${prevTopicData.topic}`}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Previous
              </a>
            ) : prevChapter ? (
              <a 
                href={`/chapters/${prevChapter}`}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Previous Chapter
              </a>
            ) : (
              <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                Previous
              </span>
            )}
            
            {nextTopicData ? (
              <a 
                href={`/chapters/${nextTopicData.chapter}/topics/${nextTopicData.topic}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next →
              </a>
            ) : nextChapter ? (
              <a 
                href={`/chapters/${nextChapter}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Chapter >
              </a>
            ) : (
              <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                Next →
              </span>
            )}
            
            {nextChapter && (
              <a 
                href={`/chapters/${nextChapter}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Chapter >
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Goal and Vocabulary */}
      {lesson.explanation && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Goal and Vocabulary</h2>
          </div>
          <p className="text-gray-700 mb-4">{lesson.explanation}</p>
          
          {lesson.example && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="font-medium text-gray-900">Examples</span>
              </div>
              <div className="space-y-2 text-sm">
                {lesson.example.split(' | ').map((example, index) => (
                  <div key={index} className="text-gray-700">{example}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      {lesson.example_tips && (
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="font-semibold text-yellow-800">Tips</h3>
          </div>
          <p className="text-yellow-700">{lesson.example_tips}</p>
        </div>
      )}

      {/* Example Dialogue */}
      {lesson.dialogue && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Example Dialogue</h2>
          </div>
          <p className="text-gray-700 mb-4">Here's how you can use this in conversation:</p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-medium text-gray-900">Examples</span>
            </div>
            <div className="space-y-2 text-sm">
              {lesson.dialogue.split(' | ').map((dialogue, index) => (
                <div key={index} className="text-gray-700">{dialogue}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}