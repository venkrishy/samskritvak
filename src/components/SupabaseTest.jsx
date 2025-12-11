import { useState, useEffect } from 'react'
import { CurriculumService } from '../services/curriculumService'

export default function SupabaseTest() {
  const [testResults, setTestResults] = useState({
    chapters: null,
    curriculum: null,
    error: null
  })
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    setTestResults({ chapters: null, curriculum: null, error: null })

    try {
      const [chapters, curriculum] = await Promise.all([
        CurriculumService.getChapters(),
        CurriculumService.getAllCurriculum()
      ])

      setTestResults({
        chapters,
        curriculum,
        error: null
      })
    } catch (error) {
      setTestResults({
        chapters: null,
        curriculum: null,
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Supabase Connection'}
        </button>
      </div>

      {testResults.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{testResults.error}</p>
        </div>
      )}

      {testResults.chapters && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Chapters Loaded</h3>
          <p className="text-green-700 mb-2">Found {testResults.chapters.length} chapters:</p>
          <ul className="list-disc list-inside text-sm text-green-600">
            {testResults.chapters.map((chapter, index) => (
              <li key={index}>
                Chapter {chapter.chapter_order}: {chapter.chapter_title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {testResults.curriculum && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">✅ Curriculum Loaded</h3>
          <p className="text-blue-700 mb-2">Found {testResults.curriculum.length} total curriculum items:</p>
          <div className="text-sm text-blue-600 max-h-40 overflow-y-auto">
            {testResults.curriculum.slice(0, 10).map((item, index) => (
              <div key={index} className="mb-1">
                {item.chapter_order}.{item.topic_order} - {item.topic_title}
              </div>
            ))}
            {testResults.curriculum.length > 10 && (
              <div className="text-gray-500">... and {testResults.curriculum.length - 10} more</div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Instructions</h3>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          <li>Click "Test Supabase Connection" to verify database connectivity</li>
          <li>Check that chapters and curriculum data load successfully</li>
          <li>If successful, you can navigate to <code>/curriculum</code> to see the dynamic curriculum page</li>
          <li>Try navigating to <code>/chapters/1</code> to see a dynamic chapter page</li>
          <li>Try navigating to <code>/chapters/1/topics/1.1</code> to see a dynamic lesson page</li>
        </ol>
      </div>
    </div>
  )
}
