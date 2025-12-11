import { getChapterData, getNextChapter, getPreviousChapter } from '@/lib/curriculumData'

interface ChapterPageProps {
  params: {
    chapter: string
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapter } = await params
  const chapterNumber = parseInt(chapter)
  
  const chapterInfo = getChapterData(chapterNumber)
  const nextChapter = getNextChapter(chapterNumber)
  const prevChapter = getPreviousChapter(chapterNumber)
  
  if (!chapterInfo) {
    return <div className="container mx-auto p-8 text-red-500">Chapter not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Chapter {chapter}: {chapterInfo.title}
        </h1>
        <p className="text-blue-600 text-lg">{chapterInfo.description}</p>
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Level Beginner
          </span>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapterInfo.topics.map((topic: any, index: number) => (
          <a
            key={index}
            href={`/chapters/${chapter}/topics/${topic.number}`}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">{topic.number}</span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {topic.title}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Click to start learning this topic
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Beginner</span>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        {prevChapter ? (
          <a
            href={`/chapters/${prevChapter}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Previous Chapter
          </a>
        ) : (
          <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
            ← Previous Chapter
          </span>
        )}
        
        <a
          href="/dashboard"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </a>
        
        {nextChapter ? (
          <a
            href={`/chapters/${nextChapter}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Chapter →
          </a>
        ) : (
          <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
            Next Chapter →
          </span>
        )}
      </div>
    </div>
  )
}
