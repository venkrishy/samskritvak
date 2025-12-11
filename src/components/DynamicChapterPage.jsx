import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CurriculumService } from '../services/curriculumService'
import ChapterTitleCard from './cards/ChapterTitleCard'
import TopicCard from './cards/TopicCard'

export default function DynamicChapterPage() {
  const { chapter } = useParams()
  const navigate = useNavigate()
  const [chapterData, setChapterData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadChapter()
  }, [chapter])

  const loadChapter = async () => {
    try {
      setLoading(true)
      setError(null)
      const chapterNum = parseInt(chapter)
      const data = await CurriculumService.getChapterWithTopics(chapterNum)
      setChapterData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapter...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Chapter</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/curriculum')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Curriculum
          </button>
        </div>
      </div>
    )
  }

  if (!chapterData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chapter Not Found</h2>
          <p className="text-gray-600 mb-4">The chapter you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/curriculum')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Curriculum
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <button 
              onClick={() => navigate('/curriculum')}
              className="hover:text-blue-600"
            >
              Curriculum
            </button>
            <span>›</span>
            <span className="text-gray-900">Chapter {chapterData.chapter_number}</span>
          </div>
        </nav>

        {/* Chapter Header */}
        <ChapterTitleCard
          chapterNumber={chapterData.chapter_number}
          chapterTitle={chapterData.chapter_title}
          lessonNumber={0}
          totalLessons={chapterData.topics.length}
          nextChapter={null}
          prevChapter={null}
          nextLesson={null}
          prevLesson={null}
          title={`Chapter ${chapterData.chapter_number}: ${chapterData.chapter_title}`}
          subtitle={`${chapterData.topics.length} topics in this chapter`}
          level=""
          progress={0}
        />

        {/* Topics Grid */}
        <div className="space-y-4">
          {chapterData.topics.map((topic, index) => (
            <div key={topic.id || index} className="mb-4">
              <TopicCard
                currentLesson={topic.topic_title}
                lessonNumber={topic.topic_order}
                totalLessons={chapterData.topics.length}
                nextLesson={index < chapterData.topics.length - 1 ? { 
                  url: `/chapters/${chapter}/topics/${chapterData.topics[index + 1].topic_order}` 
                } : null}
                prevLesson={index > 0 ? { 
                  url: `/chapters/${chapter}/topics/${chapterData.topics[index - 1].topic_order}` 
                } : null}
              />
            </div>
          ))}
        </div>

        {/* Chapter Navigation */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/curriculum')}
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Curriculum
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Chapter Progress</div>
              <div className="text-lg font-semibold text-gray-900">
                Chapter {chapterData.chapter_number}: {chapterData.chapter_title}
              </div>
            </div>

            {chapterData.topics.length > 0 && (
              <Link
                to={`/chapters/${chapter}/topics/${chapterData.topics[0].topic_order}`}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Chapter
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
