import { createServerClient } from '@/lib/supabaseServer'
import Link from 'next/link'

export default async function TeacherLessons() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('lessons')
    .select('id, title, status, chapter_number, slug')
    .order('chapter_number')

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Lessons</h1>
        <Link className="underline" href="/teacher/lessons/new">New lesson</Link>
      </div>
      <ul className="space-y-2">
        {data?.map(row => (
          <li key={row.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{row.title}</div>
              <div className="text-sm text-gray-600">Chapter {row.chapter_number} / {row.slug} • {row.status}</div>
            </div>
            <Link className="underline" href={`/teacher/lessons/${row.id}/edit`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}



