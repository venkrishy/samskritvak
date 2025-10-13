import ChapterTitleCard from '@/components/cards/ChapterTitleCard'
import ExplanationCard from '@/components/cards/ExplanationCard'
import ImageCard from '@/components/cards/ImageCard'
import QuizCard from '@/components/cards/QuizCard'
import { getLessonNavigation } from '@/lib/navigation'
import { useLesson } from '@/hooks/useLesson'

export default function GreetingsIdentityPage() {
  const navigation = getLessonNavigation('/01-getting-started/greetings-identity');
  const { lesson, loading, error } = useLesson('1'); // Use lesson ID 1 from Notion
  
  if (loading) return <div>Loading lesson from Notion...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!lesson) return <div>No lesson found</div>;

  return (
    <div className="space-y-4">
      {/* Chapter & Title Card */}
      <ChapterTitleCard 
        {...navigation}
        title={lesson.content?.title || "1.1 - Greetings and Identity"}
        subtitle={lesson.content?.subtitle || "Basic greetings and introducing yourself in Sanskrit"}
        level={lesson.content?.level || "Beginner"}
        progress={lesson.content?.progress || 50}
      />
      
      {/* Vocabulary and Goal Card */}
      {lesson.content?.goalAndVocabulary && (
        <ExplanationCard 
          title={lesson.content.goalAndVocabulary.title}
          content={lesson.content.goalAndVocabulary.content}
          examples={lesson.content.goalAndVocabulary.examples || []}
          tips={lesson.content.goalAndVocabulary.tips}
        />
      )}
      
      {/* Tips Card */}
      {lesson.content?.tips && (
        <ExplanationCard 
          title={lesson.content.tips.title}
          content={lesson.content.tips.content}
          examples={lesson.content.tips.examples || []}
          tips={lesson.content.tips.tips}
        />
      )}
      
      {/* Example Dialogue Card */}
      {lesson.content?.exampleDialogue && (
        <ExplanationCard 
          title={lesson.content.exampleDialogue.title}
          content={lesson.content.exampleDialogue.content}
          examples={lesson.content.exampleDialogue.examples || []}
          tips={lesson.content.exampleDialogue.tips}
        />
      )}
      
      {/* Image Card for Practice */}
      <ImageCard 
        imageSrc="/images/greetings-practice.png"
        imageAlt="Two people greeting each other in traditional Indian style"
        description="<p>Practice the greeting conversation with a partner. Use the vocabulary you've learned to introduce yourself and ask for their name.</p><p><strong>Role Playing Prompt:</strong> Imagine you're meeting someone new at a Sanskrit class. Practice introducing yourself and asking for their name. Use the vocabulary above to have a natural conversation!</p>"
        placeholder="Write a Sanskrit greeting and introduction in transliteration..."
      />
      
      {/* Quiz Cards */}
      <QuizCard 
        question="What does 'namaste' mean?"
        options={["Goodbye", "Hello", "Thank you", "Please"]}
        correctAnswer="Hello"
        explanation="'Namaste' is the most common Sanskrit greeting, meaning 'hello' or 'greetings'. It's used throughout India and in Sanskrit learning."
      />
      
      <QuizCard 
        question="Complete this sentence: 'mama nāma _____' (My name is _____)"
        type="text-input"
        correctAnswer="[Your name]"
        explanation="'Mama nāma' means 'my name' in Sanskrit. You can follow it with any name or noun."
      />
    </div>
  )
}
