import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CurriculumService } from '../services/curriculumService'

export default function TableOfContents() {
  const [chapters, setChapters] = useState([])
  const [allCurriculum, setAllCurriculum] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()

  useEffect(() => {
    loadCurriculum()
  }, [])

  const loadCurriculum = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [chaptersData, allData] = await Promise.all([
        CurriculumService.getChapters(),
        CurriculumService.getAllCurriculum()
      ])
      
      setChapters(chaptersData)
      setAllCurriculum(allData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Group curriculum by chapter
  const curriculumByChapter = chapters.map(chapter => {
    const chapterTopics = allCurriculum.filter(item => item.chapter_order === chapter.chapter_order)
    return {
      ...chapter,
      topics: chapterTopics
    }
  })

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-sm text-red-600">Error loading curriculum</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {curriculumByChapter.map((chapter) => (
          <div key={chapter.chapter_order} className="mb-2">
            <Link
              to={`/chapters/${chapter.chapter_order}`}
              className={`flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-blue-50 font-medium transition-colors ${
                isActivePath(`/chapters/${chapter.chapter_order}`) 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-blue-800'
              }`}
            >
              <span>Chapter {chapter.chapter_order}: {chapter.chapter_title}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <div className="ml-4 mt-2 space-y-1">
              {chapter.topics.map((topic, index) => (
                <Link
                  key={topic.id || index}
                  to={`/chapters/${chapter.chapter_order}/topics/${topic.topic_order}`}
                  className={`flex w-full items-center justify-between rounded-lg p-2 text-left text-sm hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors ${
                    isActivePath(`/chapters/${chapter.chapter_order}/topics/${topic.topic_order}`)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="truncate">{topic.topic_order}: {topic.topic_title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
