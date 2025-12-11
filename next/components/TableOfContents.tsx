'use client'

import Link from 'next/link'
import { curriculumData } from '@/lib/curriculumData'

export default function TableOfContents() {
  return (
    <div className="w-80 border-r bg-white overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Table of Contents</h2>
        </div>
        
            {curriculumData.map((chapter) => (
          <div key={chapter.number} className="mb-2">
            <Link
              href={`/chapters/${chapter.number}`}
              className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-blue-50 font-medium text-blue-800"
            >
              <span>Chapter {chapter.number}: {chapter.title}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <div className="ml-4 mt-2 space-y-1">
              {chapter.topics.map((topic, index) => (
                <Link
                  key={index}
                  href={`/chapters/${chapter.number}/topics/${topic.number}`}
                  className="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                >
                  <span>{topic.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
