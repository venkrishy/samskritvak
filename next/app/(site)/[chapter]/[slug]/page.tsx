import { createServerClient } from '@/lib/supabaseServer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export default async function LessonPage({ params }: { params: { chapter: string, slug: string } }) {
  const supabase = createServerClient()
  const chapterNum = Number(params.chapter.replace(/[^0-9]/g, ''))
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('chapter_number', chapterNum)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return notFound()

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        {data.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.image_url} alt={data.title} className="mt-4 max-h-72 rounded" />
        )}
      </header>

      {data.goal_vocabulary_md && (
        <section>
          <h2 className="text-xl font-medium mb-2">Goal & Vocabulary</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.goal_vocabulary_md}</ReactMarkdown>
        </section>
      )}

      {data.examples_md && (
        <section>
          <h2 className="text-xl font-medium mb-2">Examples</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.examples_md}</ReactMarkdown>
        </section>
      )}

      {data.tips_md && (
        <section>
          <h2 className="text-xl font-medium mb-2">Tips</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.tips_md}</ReactMarkdown>
        </section>
      )}

      {data.dialogue_md && (
        <section>
          <h2 className="text-xl font-medium mb-2">Example Dialogue</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.dialogue_md}</ReactMarkdown>
        </section>
      )}

      {data.quiz_json && (
        <section>
          <h2 className="text-xl font-medium mb-2">Quiz Time</h2>
          <div className="space-y-4">
            {(data.quiz_json as any[]).map((q, i) => (
              <div key={i} className="border rounded p-3">
                <div className="font-medium">{q.question}</div>
                <ul className="list-disc pl-6">
                  {q.options?.map((opt: string, j: number) => (
                    <li key={j}>{opt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}



