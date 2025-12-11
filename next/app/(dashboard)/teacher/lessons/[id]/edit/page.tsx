import { createServerClient } from '@/lib/supabaseServer'
import { EditorForm } from '@/components/teacher/EditorForm'
import { notFound } from 'next/navigation'

export default async function EditLesson({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data, error } = await supabase.from('lessons').select('*').eq('id', params.id).single()
  if (error || !data) return notFound()
  return <EditorForm initial={data} />
}



