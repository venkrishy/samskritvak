import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CurriculumService } from '../services/curriculumService'
import { useAuth } from '../context/AuthContext'
import ChapterTitleCard from './cards/ChapterTitleCard'
import ExplanationCard from './cards/ExplanationCard'
import ImageCard from './cards/ImageCard'
import QuizCard from './cards/QuizCard'

// Helper functions to parse database content
const parseExamples = (exampleText) => {
  if (!exampleText) return []
  
  try {
    // Try to parse as JSON first
    if (exampleText.startsWith('{') && exampleText.includes('sanskrit:')) {
      // This is the JSON format from the database
      const examples = []
      const regex = /sanskrit:\s*"([^"]+)",\s*english:\s*"([^"]+)"/g
      let match
      while ((match = regex.exec(exampleText)) !== null) {
        examples.push({
          sanskrit: match[1],
          english: match[2]
        })
      }
      return examples
    }
    
    // If not JSON, try to parse as structured text
    const lines = exampleText.split('\n').filter(line => line.trim())
    return lines.map(line => {
      if (line.includes('→')) {
        const [sanskrit, english] = line.split('→').map(s => s.trim())
        return { sanskrit, english }
      }
      return { sanskrit: line, english: '' }
    })
  } catch (error) {
    console.error('Error parsing examples:', error)
    return []
  }
}

const parseDialogue = (dialogueText) => {
  if (!dialogueText) return []
  
  try {
    // Try to parse as JSON first
    if (dialogueText.startsWith('{') && dialogueText.includes('sanskrit:')) {
      const examples = []
      const regex = /sanskrit:\s*"([^"]+)",\s*english:\s*"([^"]+)"/g
      let match
      while ((match = regex.exec(dialogueText)) !== null) {
        examples.push({
          sanskrit: match[1],
          english: match[2]
        })
      }
      return examples
    }
    
    // If not JSON, try to parse as structured text
    const lines = dialogueText.split('\n').filter(line => line.trim())
    return lines.map(line => {
      if (line.includes('→')) {
        const [sanskrit, english] = line.split('→').map(s => s.trim())
        return { sanskrit, english }
      }
      return { sanskrit: line, english: '' }
    })
  } catch (error) {
    console.error('Error parsing dialogue:', error)
    return []
  }
}

export default function DynamicLessonPage() {
  const { chapter, topic } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [navigation, setNavigation] = useState({ next: null, prev: null })

  useEffect(() => {
    loadLesson()
  }, [chapter, topic])

  const loadLesson = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const chapterNum = parseInt(chapter)
      const [lessonData, nextTopic, prevTopic] = await Promise.all([
        CurriculumService.getLesson(chapterNum, topic),
        CurriculumService.getNextTopic(chapterNum, topic),
        CurriculumService.getPreviousTopic(chapterNum, topic)
      ])
      
      setLesson(lessonData)
      setNavigation({ next: nextTopic, prev: prevTopic })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (navigation.next) {
      navigate(`/chapters/${navigation.next.chapter}/topics/${navigation.next.topic}`)
    }
  }

  const handlePrevious = () => {
    if (navigation.prev) {
      navigate(`/chapters/${navigation.prev.chapter}/topics/${navigation.prev.topic}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Lesson</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/curriculum')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Curriculum
          </button>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
          <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/curriculum')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Curriculum
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <button 
              onClick={() => navigate('/curriculum')}
              className="hover:text-blue-600"
            >
              Curriculum
            </button>
            <span>›</span>
            <button 
              onClick={() => navigate(`/chapters/${chapter}`)}
              className="hover:text-blue-600"
            >
              Chapter {lesson.chapter_order}
            </button>
            <span>›</span>
            <span className="text-gray-900">{lesson.topic_title}</span>
          </div>
        </nav>

        {/* Chapter & Title Card */}
        <ChapterTitleCard 
          chapterNumber={lesson.chapter_order}
          chapterTitle={lesson.chapter_title}
          lessonNumber={lesson.topic_order}
          totalLessons="6" // This could be calculated from chapter data
          nextChapter={null} // Could be calculated
          prevChapter={null} // Could be calculated
          nextLesson={navigation.next ? { url: `/chapters/${navigation.next.chapter}/topics/${navigation.next.topic}` } : null}
          prevLesson={navigation.prev ? { url: `/chapters/${navigation.prev.chapter}/topics/${navigation.prev.topic}` } : null}
          title={`${lesson.topic_order} - ${lesson.topic_title}`}
          subtitle={lesson.topic_description || `Learning ${lesson.topic_title.toLowerCase()}`}
          level="Beginner"
          progress={0}
        />

        {/* Goal and Vocabulary */}
        {lesson.topic_description && (
          <ExplanationCard
            title="Goal and Vocabulary"
            content={`<p>${lesson.topic_description}</p>`}
            examples={parseExamples(lesson.example)}
            tips={lesson.example_tips || ""}
          />
        )}

        {/* Explanation */}
        {lesson.explanation && (
          <ExplanationCard
            title="Explanation"
            content={`<p>${lesson.explanation}</p>`}
            examples={[]}
            tips=""
          />
        )}

        {/* Example Dialogue */}
        {lesson.dialogue && (
          <ExplanationCard
            title="Example Dialogue"
            content={`<p>Here's how you can practice these concepts:</p>`}
            examples={parseDialogue(lesson.dialogue)}
            tips=""
          />
        )}

        {/* Image Card for Practice */}
        {lesson.image_url && (
          <ImageCard 
            imageSrc={lesson.image_url}
            imageAlt={lesson.image_alt || lesson.topic_title}
            description={`<p>Practice the concepts from this lesson.</p><p><strong>Practice:</strong> Use the examples above to practice the Sanskrit phrases.</p>`}
            placeholder="Write your practice sentences here..."
          />
        )}

        {/* Quiz Cards - Generate simple quizzes based on content */}
        {lesson.example && parseExamples(lesson.example).length > 0 && (
          <QuizCard 
            question="Which of the following is correct?"
            options={[
              parseExamples(lesson.example)[0]?.english || "Option 1",
              "Option 2", 
              "Option 3", 
              "Option 4"
            ]}
            correctAnswer={parseExamples(lesson.example)[0]?.english || "Option 1"}
            explanation={`The correct answer is based on the examples from this lesson. ${lesson.example_tips || ""}`}
          />
        )}

        {/* Quick Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <button 
            onClick={() => navigate(`/chapters/${chapter}`)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to Chapter
          </button>
          <button 
            onClick={() => navigate('/curriculum')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            All Chapters
          </button>
        </div>
      </div>
    </div>
  )
}
