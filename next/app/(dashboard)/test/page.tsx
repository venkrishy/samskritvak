import { createServerClient } from '@/lib/supabaseServer'

export default async function TestPage() {
  const supabase = createServerClient()
  
  const { data: curriculum } = await supabase
    .from('curriculum')
    .select('*')
    .limit(5)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">Testing Supabase connection...</p>
      
      {curriculum && curriculum.length > 0 ? (
        <div className="space-y-2">
          <p className="text-green-600">✅ Supabase connection working!</p>
          <p>Found {curriculum.length} curriculum items:</p>
          <ul className="list-disc list-inside">
            {curriculum.map((item, index) => (
              <li key={index}>
                Chapter {item.chapter_order}: {item.topic_title}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-red-600">❌ No data found or connection failed</p>
      )}
    </div>
  )
}
