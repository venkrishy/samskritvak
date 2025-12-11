# Static Data Fallbacks

## When Supabase/External APIs Fail

When external data sources are unavailable or environment variables are missing, provide static fallback data to maintain functionality.

### Pattern: Static Curriculum Data
```typescript
// Static curriculum data for fallback
const staticCurriculum = [
  {
    number: 1,
    title: "Hello! Getting Started",
    sections: [
      { number: "1.1", title: "Greetings and Identity" },
      { number: "1.2", title: "My Name Is... (The Masculine Name)" },
      // ... more sections
    ]
  }
  // ... more chapters
]

export default function TableOfContents() {
  // Use static data instead of API calls
  return (
    <div>
      {staticCurriculum.map((chapter) => (
        // Render chapter content
      ))}
    </div>
  )
}
```

### Pattern: Mock Lesson Data
```typescript
const mockLessons: Record<string, any> = {
  '1.1': {
    topic_title: 'Greetings and Identity',
    topic_description: 'Basic greetings and introducing yourself in Sanskrit',
    explanation: 'Learn how to greet people...',
    example: 'namaste (नमस्ते) → Hello',
    // ... more lesson data
  }
}

export default async function LessonPage({ params }) {
  const { topic } = await params
  const lesson = mockLessons[topic] || {
    // Fallback lesson data
  }
  // ... render lesson
}
```

## Benefits:
- App works without external dependencies
- No blank screens or errors
- Better user experience
- Easier development and testing

## Implementation Strategy:
1. Create static data structures
2. Use as fallback when API fails
3. Provide meaningful default content
4. Maintain same data structure as API
5. Test with and without external data

## Common Use Cases:
- Table of contents when Supabase unavailable
- Lesson content when database empty
- User progress when auth not working
- Navigation menus when CMS down
