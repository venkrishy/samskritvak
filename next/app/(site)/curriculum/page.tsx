import { createServerClient } from '@/lib/supabaseServer'
import Link from 'next/link'

export default async function CurriculumPage() {
  const supabase = createServerClient()
  
  // Get all chapters
  const { data: chapters } = await supabase
    .from('curriculum')
    .select('chapter_order, chapter_title')
    .order('chapter_order')

  // Get unique chapters
  const uniqueChapters = chapters?.reduce((acc, item) => {
    if (!acc.find(ch => ch.chapter_order === item.chapter_order)) {
      acc.push(item)
    }
    return acc
  }, [] as typeof chapters) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sanskrit Curriculum</h1>
          <p className="text-xl text-gray-600">Complete learning path from beginner to advanced</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {uniqueChapters.map((chapter) => (
            <Link
              key={chapter.chapter_order}
              href={`/chapters/${chapter.chapter_order}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">{chapter.chapter_order}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Chapter {chapter.chapter_order}
                  </h3>
                  <p className="text-sm text-gray-500">Beginner Level</p>
                </div>
              </div>
              
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {chapter.chapter_title}
              </h4>
              
              <p className="text-gray-600 text-sm mb-4">
                Learn the fundamentals of Sanskrit through structured lessons and practice exercises.
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">6 lessons</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to start learning?</h2>
            <p className="text-gray-600 mb-6">Join thousands of students already learning Sanskrit with Samskritavak</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/google"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.676 31.659 29.223 35 24 35 16.82 35 11 29.18 11 22S16.82 9 24 9c3.17 0 6.066 1.203 8.262 3.162l5.657-5.657C34.676 2.676 29.676 1 24 1 10.745 1 0 11.745 0 25s10.745 24 24 24 24-10.745 24-24c0-1.627-.174-3.214-.389-4.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.26 15.108 18.76 12 24 12c3.17 0 6.066 1.203 8.262 3.162l5.657-5.657C34.676 5.676 29.676 4 24 4 15.319 4 7.846 8.717 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 46c5.166 0 9.86-1.977 13.393-5.197l-6.19-5.238C29.145 37.488 26.7 38 24 38c-5.196 0-9.632-3.305-11.24-7.943l-6.51 5.02C8.737 41.74 15.86 46 24 46z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.091 3.159-3.48 5.651-6.503 7.014.001-.001 6.19 5.238 6.19 5.238C37.43 38.162 40 32.5 40 26c0-2.033-.222-3.984-.389-5.917z"/>
                </svg>
                Start Learning with Google
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse All Lessons
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
